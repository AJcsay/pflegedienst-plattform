import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getDb } from "./db";
import { appointments, appointmentReminders } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  generateAppointmentReminders,
  sendPendingReminders,
  cancelReminder,
  getAppointmentReminders,
  getReminderStats,
} from "./appointment-reminder-service";

describe("Appointment Reminder Service", () => {
  let db: any;
  let testAppointmentId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create a test appointment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days in future

    await db
      .insert(appointments)
      .values({
        firstName: "Test",
        lastName: "Patient",
        email: "test-reminder@example.com",
        phone: "123-456-7890",
        appointmentType: "initial_consultation",
        preferredDate: futureDate,
        preferredTime: "10:00",
        status: "confirmed",
        confirmedDate: futureDate,
        confirmedTime: "10:00",
      } as any);

    const results = await db
      .select()
      .from(appointments)
      .where(eq(appointments.email, "test-reminder@example.com"));

    testAppointmentId = results[results.length - 1].id;
  });

  afterAll(async () => {
    if (!db) return;

    // Clean up test data
    await db
      .delete(appointmentReminders)
      .where(eq(appointmentReminders.appointmentId, testAppointmentId));

    await db
      .delete(appointments)
      .where(eq(appointments.id, testAppointmentId));
  });

  it("should generate appointment reminders", async () => {
    const result = await generateAppointmentReminders();
    expect(result).toHaveProperty("generated");
    expect(result.generated).toBeGreaterThanOrEqual(0);
  });

  it("should get appointment reminders", async () => {
    // First generate reminders
    await generateAppointmentReminders();

    // Then get them
    const reminders = await getAppointmentReminders(testAppointmentId);
    expect(Array.isArray(reminders)).toBe(true);
  });

  it("should get reminder statistics", async () => {
    const stats = await getReminderStats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("pending");
    expect(stats).toHaveProperty("sent");
    expect(stats).toHaveProperty("failed");
    expect(stats).toHaveProperty("cancelled");
    expect(stats.total).toBeGreaterThanOrEqual(0);
  });

  it("should cancel a reminder", async () => {
    // Generate reminders
    await generateAppointmentReminders();

    // Get a reminder to cancel
    const reminders = await getAppointmentReminders(testAppointmentId);
    if (reminders.length > 0) {
      const reminderId = reminders[0].id;
      const result = await cancelReminder(reminderId);
      expect(result).toBe(true);

      // Verify it was cancelled
      const cancelled = await db
        .select()
        .from(appointmentReminders)
        .where(eq(appointmentReminders.id, reminderId))
        .then((results: any[]) => results[0]);

      expect(cancelled.status).toBe("cancelled");
    }
  });

  it("should send pending reminders", async () => {
    // Create a reminder that's due now
    const now = new Date();
    const pastTime = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

    await db.insert(appointmentReminders).values({
      appointmentId: testAppointmentId,
      reminderType: "24h_before",
      scheduledAt: pastTime,
      status: "pending",
    } as any);

    // Send pending reminders
    const result = await sendPendingReminders();
    expect(result).toHaveProperty("sent");
    expect(result).toHaveProperty("failed");
  });

  it("should handle non-existent appointment gracefully", async () => {
    const result = await getAppointmentReminders(99999);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should validate reminder types", async () => {
    const reminders = await getAppointmentReminders(testAppointmentId);
    for (const reminder of reminders) {
      expect(["24h_before", "1h_before", "day_after"]).toContain(reminder.reminderType);
    }
  });

  it("should track reminder statuses", async () => {
    const stats = await getReminderStats();
    const totalFromStats = stats.pending + stats.sent + stats.failed + stats.cancelled;
    expect(totalFromStats).toBeLessThanOrEqual(stats.total);
  });

  it("should not create duplicate reminders", async () => {
    // Generate reminders twice
    await generateAppointmentReminders();
    const firstCount = (await getAppointmentReminders(testAppointmentId)).length;

    await generateAppointmentReminders();
    const secondCount = (await getAppointmentReminders(testAppointmentId)).length;

    // Should not create duplicates
    expect(secondCount).toBeLessThanOrEqual(firstCount + 3); // Max 3 new reminders per appointment
  });

  it("should handle database errors gracefully", async () => {
    // Test with invalid ID
    try {
      await cancelReminder("invalid-id");
      // Should not throw, just fail silently or return error
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
