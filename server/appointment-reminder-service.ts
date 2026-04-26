import { getDb } from "./db";
import { appointmentReminders, appointments } from "../drizzle/schema";
import { eq, and, lt, desc } from "drizzle-orm";
import { sendAppointmentReminder24h, sendAppointmentReminder1h, sendFeedbackSurveyEmail } from "./email-service";
import { createFeedbackSurvey } from "./feedback-survey-service";

export type ReminderType = "24h_before" | "1h_before" | "day_after";

/**
 * Generate appointment reminders for upcoming appointments
 * Called by background job to create reminders for appointments
 */
export async function generateAppointmentReminders() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const now = new Date();
    const reminders: { appointmentId: number; reminderType: ReminderType; scheduledAt: Date }[] = [];

    // Get all confirmed appointments
    const confirmedAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.status, "confirmed"));

    for (const appointment of confirmedAppointments) {
      if (!appointment.confirmedDate) continue;

      const appointmentTime = new Date(appointment.confirmedDate);
      
      // Check if 24h reminder should be scheduled
      const time24hBefore = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
      const time1hBefore = new Date(appointmentTime.getTime() - 60 * 60 * 1000);
      const timeDayAfter = new Date(appointmentTime.getTime() + 24 * 60 * 60 * 1000);

      // Check existing reminders
      const existingReminders = await db
        .select()
        .from(appointmentReminders)
        .where(eq(appointmentReminders.appointmentId, appointment.id)) as any[];

      const existingTypes = new Set(existingReminders.map((r) => r.reminderType));

      // Schedule 24h reminder
      if (!existingTypes.has("24h_before") && now < time24hBefore) {
        reminders.push({
          appointmentId: appointment.id,
          reminderType: "24h_before",
          scheduledAt: time24hBefore,
        });
      }

      // Schedule 1h reminder
      if (!existingTypes.has("1h_before") && now < time1hBefore) {
        reminders.push({
          appointmentId: appointment.id,
          reminderType: "1h_before",
          scheduledAt: time1hBefore,
        });
      }

      // Schedule day-after feedback reminder
      if (!existingTypes.has("day_after") && now < timeDayAfter) {
        reminders.push({
          appointmentId: appointment.id,
          reminderType: "day_after",
          scheduledAt: timeDayAfter,
        });
      }
    }

    // Insert new reminders
    if (reminders.length > 0) {
      for (const reminder of reminders) {
        await db.insert(appointmentReminders).values({
          appointmentId: reminder.appointmentId,
          reminderType: reminder.reminderType,
          scheduledAt: reminder.scheduledAt,
          status: "pending",
        } as any);
      }
    }

    return { generated: reminders.length };
  } catch (error) {
    console.error("[Appointment Reminders] Error generating reminders:", error);
    throw error;
  }
}

/**
 * Send pending appointment reminders
 * Called by background job to send due reminders
 */
export async function sendPendingReminders() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const now = new Date();

    // Get all pending reminders that are due
    const pendingReminders = await db
      .select()
      .from(appointmentReminders)
      .where(
        and(
          eq(appointmentReminders.status, "pending"),
          lt(appointmentReminders.scheduledAt, now)
        )
      );

    let sent = 0;
    let failed = 0;

    for (const reminder of pendingReminders) {
      try {
        // Get appointment details
        const appointment = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, reminder.appointmentId))
          .then((results: any[]) => results[0]);

        if (!appointment) {
          // Mark as failed if appointment not found
          await db
            .update(appointmentReminders)
            .set({
              status: "failed",
              failureReason: "Appointment not found",
            })
            .where(eq(appointmentReminders.id, reminder.id));
          failed++;
          continue;
        }

        // Send email based on reminder type
        let emailSent = false;
        try {
          if (reminder.reminderType === "24h_before") {
            emailSent = await sendAppointmentReminder24h({
              firstName: appointment.firstName,
              lastName: appointment.lastName,
              email: appointment.email,
              appointmentType: appointment.appointmentType,
              preferredDate: appointment.confirmedDate || appointment.preferredDate,
              careNeeds: appointment.careNeeds,
            });
          } else if (reminder.reminderType === "1h_before") {
            emailSent = await sendAppointmentReminder1h({
              firstName: appointment.firstName,
              lastName: appointment.lastName,
              email: appointment.email,
              appointmentType: appointment.appointmentType,
              preferredDate: appointment.confirmedDate || appointment.preferredDate,
              careNeeds: appointment.careNeeds,
            });
          } else if (reminder.reminderType === "day_after") {
            // Create feedback survey and send survey email
            const survey = await createFeedbackSurvey(appointment.id);
            const surveyUrl = `${process.env.APP_URL || "https://www.curamain.de"}/survey/${survey.surveyToken}`;
            emailSent = await sendFeedbackSurveyEmail(
              {
                firstName: appointment.firstName,
                lastName: appointment.lastName,
                email: appointment.email,
                appointmentType: appointment.appointmentType,
              },
              survey.surveyToken,
              surveyUrl
            );
          }
        } catch (emailError) {
          console.error(`[Appointment Reminders] Error sending email for reminder ${reminder.id}:`, emailError);
          emailSent = false;
        }

        if (emailSent) {
          await db
            .update(appointmentReminders)
            .set({
              status: "sent",
              sentAt: new Date(),
            })
            .where(eq(appointmentReminders.id, reminder.id));
          sent++;
        } else {
          await db
            .update(appointmentReminders)
            .set({
              status: "failed",
              failureReason: "Email sending failed",
            })
            .where(eq(appointmentReminders.id, reminder.id));
          failed++;
        }
      } catch (error) {
        console.error(`[Appointment Reminders] Error sending reminder ${reminder.id}:`, error);
        await db
          .update(appointmentReminders)
          .set({
            status: "failed",
            failureReason: error instanceof Error ? error.message : "Unknown error",
          })
          .where(eq(appointmentReminders.id, reminder.id));
        failed++;
      }
    }

    console.log(
      `[Appointment Reminders] Sent: ${sent}, Failed: ${failed}, Total: ${sent + failed}`
    );
    return { sent, failed };
  } catch (error) {
    console.error("[Appointment Reminders] Error sending reminders:", error);
    throw error;
  }
}

/**
 * Cancel a scheduled reminder
 */
export async function cancelReminder(reminderId: string) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    await db
      .update(appointmentReminders)
      .set({ status: "cancelled" })
      .where(eq(appointmentReminders.id, reminderId));
    return true;
  } catch (error) {
    console.error("[Appointment Reminders] Error cancelling reminder:", error);
    throw error;
  }
}

/**
 * Get scheduled reminders for an appointment
 */
export async function getAppointmentReminders(appointmentId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    return await db
      .select()
      .from(appointmentReminders)
      .where(eq(appointmentReminders.appointmentId, appointmentId));
  } catch (error) {
    console.error("[Appointment Reminders] Error getting reminders:", error);
    throw error;
  }
}

/**
 * Get all reminders with appointment info (for admin list view)
 * Paginated to avoid loading the entire table into memory.
 */
export async function getAllReminders(limit = 500, offset = 0) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const reminders = await db
      .select({
        id: appointmentReminders.id,
        appointmentId: appointmentReminders.appointmentId,
        reminderType: appointmentReminders.reminderType,
        scheduledAt: appointmentReminders.scheduledAt,
        sentAt: appointmentReminders.sentAt,
        status: appointmentReminders.status,
        failureReason: appointmentReminders.failureReason,
        createdAt: appointmentReminders.createdAt,
        patientFirstName: appointments.firstName,
        patientLastName: appointments.lastName,
        patientEmail: appointments.email,
        appointmentType: appointments.appointmentType,
        appointmentStatus: appointments.status,
      })
      .from(appointmentReminders)
      .leftJoin(appointments, eq(appointmentReminders.appointmentId, appointments.id))
      .orderBy(desc(appointmentReminders.createdAt))
      .limit(limit)
      .offset(offset);

    return reminders;
  } catch (error) {
    console.error("[Appointment Reminders] Error getting all reminders:", error);
    throw error;
  }
}

/**
 * Get reminder statistics
 */
export async function getReminderStats() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const reminders = await db.select().from(appointmentReminders);

    const stats = {
      total: reminders.length,
      pending: reminders.filter((r: any) => r.status === "pending").length,
      sent: reminders.filter((r: any) => r.status === "sent").length,
      failed: reminders.filter((r: any) => r.status === "failed").length,
      cancelled: reminders.filter((r: any) => r.status === "cancelled").length,
    };

    return stats;
  } catch (error) {
    console.error("[Appointment Reminders] Error getting stats:", error);
    throw error;
  }
}
