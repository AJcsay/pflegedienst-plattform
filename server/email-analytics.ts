import { getDb } from './db';
import { campaignRecipients } from '../drizzle/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Track email open (via pixel)
 */
export async function trackEmailOpen(recipientId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    await db
      .update(campaignRecipients)
      .set({
        status: 'opened',
        openedAt: new Date(),
      })
      .where(eq(campaignRecipients.id, recipientId));

    return { success: true };
  } catch (error) {
    console.error('[Email Analytics] Failed to track open:', error);
    throw error;
  }
}

/**
 * Track email click (via tracking link)
 */
export async function trackEmailClick(recipientId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    await db
      .update(campaignRecipients)
      .set({
        status: 'clicked',
        clickedAt: new Date(),
      })
      .where(eq(campaignRecipients.id, recipientId));

    return { success: true };
  } catch (error) {
    console.error('[Email Analytics] Failed to track click:', error);
    throw error;
  }
}

/**
 * Get campaign analytics
 */
export async function getCampaignAnalytics(campaignId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const recipients = await db
      .select()
      .from(campaignRecipients)
      .where(eq(campaignRecipients.campaignId, campaignId));

    const totalRecipients = recipients.length;
    const sentCount = recipients.filter(r => r.status !== 'pending').length;
    const openedCount = recipients.filter(r => r.status === 'opened' || r.status === 'clicked').length;
    const clickedCount = recipients.filter(r => r.status === 'clicked').length;
    const bouncedCount = recipients.filter(r => r.status === 'bounced').length;

    const openRate = totalRecipients > 0 ? (openedCount / sentCount) * 100 : 0;
    const clickRate = totalRecipients > 0 ? (clickedCount / sentCount) * 100 : 0;
    const bounceRate = totalRecipients > 0 ? (bouncedCount / totalRecipients) * 100 : 0;

    return {
      campaignId,
      totalRecipients,
      sentCount,
      openedCount,
      clickedCount,
      bouncedCount,
      openRate: parseFloat(openRate.toFixed(2)),
      clickRate: parseFloat(clickRate.toFixed(2)),
      bounceRate: parseFloat(bounceRate.toFixed(2)),
      recipients,
    };
  } catch (error) {
    console.error('[Email Analytics] Failed to get campaign analytics:', error);
    throw error;
  }
}

/**
 * Get all campaigns analytics summary
 */
export async function getAllCampaignsAnalytics() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const recipients = await db.select().from(campaignRecipients);

    // Group by campaign
    const campaignMap = new Map<string, any[]>();
    recipients.forEach(r => {
      if (!campaignMap.has(r.campaignId)) {
        campaignMap.set(r.campaignId, []);
      }
      campaignMap.get(r.campaignId)!.push(r);
    });

    const analytics = Array.from(campaignMap.entries()).map(([campaignId, campaignRecipients]) => {
      const totalRecipients = campaignRecipients.length;
      const sentCount = campaignRecipients.filter(r => r.status !== 'pending').length;
      const openedCount = campaignRecipients.filter(r => r.status === 'opened' || r.status === 'clicked').length;
      const clickedCount = campaignRecipients.filter(r => r.status === 'clicked').length;
      const bouncedCount = campaignRecipients.filter(r => r.status === 'bounced').length;

      const openRate = sentCount > 0 ? (openedCount / sentCount) * 100 : 0;
      const clickRate = sentCount > 0 ? (clickedCount / sentCount) * 100 : 0;
      const bounceRate = totalRecipients > 0 ? (bouncedCount / totalRecipients) * 100 : 0;

      return {
        campaignId,
        totalRecipients,
        sentCount,
        openedCount,
        clickedCount,
        bouncedCount,
        openRate: parseFloat(openRate.toFixed(2)),
        clickRate: parseFloat(clickRate.toFixed(2)),
        bounceRate: parseFloat(bounceRate.toFixed(2)),
      };
    });

    return analytics;
  } catch (error) {
    console.error('[Email Analytics] Failed to get all campaigns analytics:', error);
    throw error;
  }
}

/**
 * Generate tracking pixel URL
 */
export function generateTrackingPixelUrl(recipientId: string, baseUrl: string = process.env.VITE_FRONTEND_URL || 'https://curamain.de'): string {
  return `${baseUrl}/api/track/open?id=${encodeURIComponent(recipientId)}`;
}

/**
 * Generate tracking link
 */
export function generateTrackingLink(recipientId: string, targetUrl: string, baseUrl: string = process.env.VITE_FRONTEND_URL || 'https://curamain.de'): string {
  return `${baseUrl}/api/track/click?id=${encodeURIComponent(recipientId)}&url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Get email performance metrics
 */
export async function getEmailPerformanceMetrics() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  try {
    const recipients = await db.select().from(campaignRecipients);

    const totalEmails = recipients.length;
    const sentEmails = recipients.filter(r => r.status !== 'pending').length;
    const openedEmails = recipients.filter(r => r.status === 'opened' || r.status === 'clicked').length;
    const clickedEmails = recipients.filter(r => r.status === 'clicked').length;
    const bouncedEmails = recipients.filter(r => r.status === 'bounced').length;

    const avgOpenRate = sentEmails > 0 ? (openedEmails / sentEmails) * 100 : 0;
    const avgClickRate = sentEmails > 0 ? (clickedEmails / sentEmails) * 100 : 0;
    const avgBounceRate = totalEmails > 0 ? (bouncedEmails / totalEmails) * 100 : 0;

    return {
      totalEmails,
      sentEmails,
      openedEmails,
      clickedEmails,
      bouncedEmails,
      avgOpenRate: parseFloat(avgOpenRate.toFixed(2)),
      avgClickRate: parseFloat(avgClickRate.toFixed(2)),
      avgBounceRate: parseFloat(avgBounceRate.toFixed(2)),
    };
  } catch (error) {
    console.error('[Email Analytics] Failed to get performance metrics:', error);
    throw error;
  }
}
