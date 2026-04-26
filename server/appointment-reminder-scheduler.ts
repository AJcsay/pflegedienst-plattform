import { generateAppointmentReminders, sendPendingReminders } from "./appointment-reminder-service";

let reminderJobInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Start the appointment reminder scheduler
 * Runs every 15 minutes to:
 * 1. Generate reminders for upcoming appointments
 * 2. Send due reminders
 */
export function startAppointmentReminderScheduler() {
  if (reminderJobInterval) {
    console.log("[Appointment Reminder Scheduler] Already running");
    return;
  }

  console.log("[Appointment Reminder Scheduler] Starting scheduler (15-minute cadence)");

  // Run immediately on startup
  executeReminderJob();

  // Then run every 15 minutes
  reminderJobInterval = setInterval(() => {
    executeReminderJob();
  }, 15 * 60 * 1000); // 15 minutes in milliseconds
}

/**
 * Execute the reminder job
 */
async function executeReminderJob() {
  if (isRunning) {
    console.log("[Appointment Reminder Scheduler] Job already running, skipping...");
    return;
  }

  isRunning = true;
  const startTime = new Date();

  try {
    console.log(`[Appointment Reminder Scheduler] Job started at ${startTime.toISOString()}`);

    // Step 1: Generate reminders for upcoming appointments
    console.log("[Appointment Reminder Scheduler] Generating reminders for upcoming appointments...");
    const generateResult = await generateAppointmentReminders();
    console.log(
      `[Appointment Reminder Scheduler] Generated ${generateResult.generated} new reminders`
    );

    // Step 2: Send pending reminders
    console.log("[Appointment Reminder Scheduler] Sending pending reminders...");
    const sendResult = await sendPendingReminders();
    console.log(
      `[Appointment Reminder Scheduler] Sent: ${sendResult.sent}, Failed: ${sendResult.failed}`
    );

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    console.log(
      `[Appointment Reminder Scheduler] Job completed in ${duration}ms at ${endTime.toISOString()}`
    );
  } catch (error) {
    console.error("[Appointment Reminder Scheduler] Error during job execution:", error);
  } finally {
    isRunning = false;
  }
}

/**
 * Stop the appointment reminder scheduler
 */
export function stopAppointmentReminderScheduler() {
  if (reminderJobInterval) {
    clearInterval(reminderJobInterval);
    reminderJobInterval = null;
    console.log("[Appointment Reminder Scheduler] Stopped");
  }
}

/**
 * Get scheduler status
 */
export function getReminderSchedulerStatus() {
  return {
    running: reminderJobInterval !== null,
    isExecuting: isRunning,
    cadence: "15 minutes",
  };
}
