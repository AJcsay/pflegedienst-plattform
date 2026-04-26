/**
 * Campaign Scheduler Service
 * Manages scheduled email campaign sending
 */

import { getDb } from './db';
import { emailCampaigns, campaignRecipients } from '../drizzle/schema';
import { eq, and, lte, gte } from 'drizzle-orm';
import { sendCampaign } from './campaign-service-simple';

/**
 * Check and send scheduled campaigns that are due
 * Should be called periodically (e.g., every minute)
 */
export async function processScheduledCampaigns(): Promise<{ processed: number; sent: number; failed: number }> {
  const db = await getDb();
  if (!db) {
    console.error('[Scheduler] Database not available');
    return { processed: 0, sent: 0, failed: 0 };
  }

  try {
    const now = new Date();

    // Find campaigns that are scheduled and due
    const dueCampaigns = await db
      .select()
      .from(emailCampaigns)
      .where(
        and(
          eq(emailCampaigns.status, 'scheduled'),
          lte(emailCampaigns.scheduledAt, now)
        )
      );

    console.log(`[Scheduler] Found ${dueCampaigns.length} campaigns due for sending`);

    let sent = 0;
    let failed = 0;

    for (const campaign of dueCampaigns) {
      try {
        // Update status to sending
        await db
          .update(emailCampaigns)
          .set({ status: 'sending' })
          .where(eq(emailCampaigns.id, campaign.id));

        // Send the campaign
        const result = await sendCampaign(campaign.id);

        sent++;
        console.log(`[Scheduler] Campaign ${campaign.id} sent successfully (${result.sentCount}/${result.totalRecipients} recipients)`);
        
        if (result.bounceCount > 0) {
          console.warn(`[Scheduler] Campaign ${campaign.id} had ${result.bounceCount} bounces`);
        }
      } catch (error) {
        failed++;
        console.error(`[Scheduler] Error processing campaign ${campaign.id}:`, error);
        // Update status back to scheduled
        try {
          await db
            .update(emailCampaigns)
            .set({ status: 'scheduled' })
            .where(eq(emailCampaigns.id, campaign.id));
        } catch (updateError) {
          console.error(`[Scheduler] Failed to update campaign status:`, updateError);
        }
      }
    }

    return { processed: dueCampaigns.length, sent, failed };
  } catch (error) {
    console.error('[Scheduler] Error processing scheduled campaigns:', error);
    return { processed: 0, sent: 0, failed: 0 };
  }
}

/**
 * Schedule a campaign for sending at a specific time
 */
export async function scheduleCampaign(campaignId: string, scheduledAt: Date): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: 'Database not available' };
  }

  try {
    // Validate scheduled time is in the future
    if (scheduledAt <= new Date()) {
      return { success: false, error: 'Scheduled time must be in the future' };
    }

    // Update campaign with scheduled time and status
    await db
      .update(emailCampaigns)
      .set({
        scheduledAt,
        status: 'scheduled',
        triggerType: 'scheduled',
      })
      .where(eq(emailCampaigns.id, campaignId));

    console.log(`[Scheduler] Campaign ${campaignId} scheduled for ${scheduledAt.toISOString()}`);
    return { success: true };
  } catch (error) {
    console.error(`[Scheduler] Error scheduling campaign ${campaignId}:`, error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Reschedule a campaign to a new time
 */
export async function rescheduleCampaign(campaignId: string, newScheduledAt: Date): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: 'Database not available' };
  }

  try {
    // Get current campaign
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId));

    if (!campaigns || campaigns.length === 0) {
      return { success: false, error: 'Campaign not found' };
    }

    const campaign = campaigns[0];

    // Only allow rescheduling if campaign is scheduled or draft
    if (campaign.status !== 'scheduled' && campaign.status !== 'draft') {
      return { success: false, error: `Cannot reschedule campaign with status ${campaign.status}` };
    }

    // Validate new scheduled time is in the future
    if (newScheduledAt <= new Date()) {
      return { success: false, error: 'New scheduled time must be in the future' };
    }

    // Update campaign with new scheduled time
    await db
      .update(emailCampaigns)
      .set({
        scheduledAt: newScheduledAt,
        status: 'scheduled',
      })
      .where(eq(emailCampaigns.id, campaignId));

    console.log(`[Scheduler] Campaign ${campaignId} rescheduled to ${newScheduledAt.toISOString()}`);
    return { success: true };
  } catch (error) {
    console.error(`[Scheduler] Error rescheduling campaign ${campaignId}:`, error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Cancel a scheduled campaign
 */
export async function cancelScheduledCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
  const db = await getDb();
  if (!db) {
    return { success: false, error: 'Database not available' };
  }

  try {
    // Get current campaign
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId));

    if (!campaigns || campaigns.length === 0) {
      return { success: false, error: 'Campaign not found' };
    }

    const campaign = campaigns[0];

    // Only allow cancelling if campaign is scheduled or draft
    if (campaign.status !== 'scheduled' && campaign.status !== 'draft') {
      return { success: false, error: `Cannot cancel campaign with status ${campaign.status}` };
    }

    // Update campaign status to cancelled
    await db
      .update(emailCampaigns)
      .set({
        status: 'cancelled',
        scheduledAt: null,
      })
      .where(eq(emailCampaigns.id, campaignId));

    console.log(`[Scheduler] Campaign ${campaignId} cancelled`);
    return { success: true };
  } catch (error) {
    console.error(`[Scheduler] Error cancelling campaign ${campaignId}:`, error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get all scheduled campaigns
 */
export async function getScheduledCampaigns(): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    console.error('[Scheduler] Database not available');
    return [];
  }

  try {
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.status, 'scheduled'));

    return campaigns;
  } catch (error) {
    console.error('[Scheduler] Error fetching scheduled campaigns:', error);
    return [];
  }
}

/**
 * Get campaign scheduling info
 */
export async function getCampaignSchedulingInfo(campaignId: string): Promise<{
  id: string;
  name: string;
  status: string;
  scheduledAt: Date | null;
  recipientCount: number;
  canReschedule: boolean;
  canCancel: boolean;
} | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  try {
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId));

    if (!campaigns || campaigns.length === 0) {
      return null;
    }

    const campaign = campaigns[0];
    const canReschedule = campaign.status === 'scheduled' || campaign.status === 'draft';
    const canCancel = campaign.status === 'scheduled' || campaign.status === 'draft';

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      scheduledAt: campaign.scheduledAt,
      recipientCount: campaign.recipientCount || 0,
      canReschedule,
      canCancel,
    };
  } catch (error) {
    console.error(`[Scheduler] Error fetching scheduling info for ${campaignId}:`, error);
    return null;
  }
}
