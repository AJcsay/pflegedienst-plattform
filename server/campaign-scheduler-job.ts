/**
 * Campaign Scheduler Background Job
 * Runs periodically to process scheduled campaigns
 */

import { processScheduledCampaigns } from './campaign-scheduler';

let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Start the campaign scheduler job
 * Runs every minute to check for campaigns due for sending
 */
export function startCampaignScheduler(): void {
  if (schedulerInterval) {
    console.log('[Scheduler Job] Campaign scheduler is already running');
    return;
  }

  console.log('[Scheduler Job] Starting campaign scheduler job...');

  // Run immediately on startup
  processScheduledCampaigns().then((result) => {
    console.log(`[Scheduler Job] Initial run: ${result.processed} processed, ${result.sent} sent, ${result.failed} failed`);
  }).catch((error) => {
    console.error('[Scheduler Job] Error on initial run:', error);
  });

  // Run every minute
  schedulerInterval = setInterval(async () => {
    try {
      const result = await processScheduledCampaigns();
      if (result.processed > 0) {
        console.log(`[Scheduler Job] Run: ${result.processed} processed, ${result.sent} sent, ${result.failed} failed`);
      }
    } catch (error) {
      console.error('[Scheduler Job] Error during scheduled run:', error);
    }
  }, 60000); // 60 seconds

  console.log('[Scheduler Job] Campaign scheduler job started (runs every 60 seconds)');
}

/**
 * Stop the campaign scheduler job
 */
export function stopCampaignScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Scheduler Job] Campaign scheduler job stopped');
  }
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): { running: boolean; lastRun?: Date } {
  return {
    running: schedulerInterval !== null,
  };
}
