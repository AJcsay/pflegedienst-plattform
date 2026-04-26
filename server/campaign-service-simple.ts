import nodemailer from 'nodemailer';
import { getDb } from './db';
import { emailCampaigns, campaignRecipients, newsletterSubscribers } from '../drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface CreateCampaignInput {
  name: string;
  subject: string;
  preheader: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * Create a new email campaign (draft status)
 */
export async function createCampaign(input: CreateCampaignInput, createdBy: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(emailCampaigns).values({
    name: input.name,
    subject: input.subject,
    preheader: input.preheader,
    htmlContent: input.htmlContent,
    textContent: input.textContent,
    campaignType: 'custom',
    triggerType: 'manual',
    status: 'draft',
    createdBy,
  });

  return result;
}

/**
 * Get campaign by ID
 */
export async function getCampaign(campaignId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const campaign = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, campaignId));

  if (!campaign || campaign.length === 0) throw new Error('Campaign not found');

  const recipients = await db.select().from(campaignRecipients).where(eq(campaignRecipients.campaignId, campaignId));

  return { campaign: campaign[0], recipients };
}

/**
 * Get all campaigns
 */
export async function getAllCampaigns() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
}

/**
 * Update campaign
 */
export async function updateCampaign(campaignId: string, input: Partial<CreateCampaignInput>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(emailCampaigns)
    .set(input)
    .where(eq(emailCampaigns.id, campaignId));

  return getCampaign(campaignId);
}

/**
 * Add all newsletter subscribers as recipients
 */
export async function addAllSubscribersAsRecipients(campaignId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const subscribers = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isSubscribed, true));

  if (subscribers.length === 0) {
    throw new Error('No active subscribers found');
  }

  const recipients = subscribers.map((sub: any) => ({
    campaignId,
    subscriberId: sub.id,
    email: sub.email,
    status: 'pending' as const,
  }));

  await db.insert(campaignRecipients).values(recipients);

  // Update campaign recipient count
  await db
    .update(emailCampaigns)
    .set({ recipientCount: subscribers.length })
    .where(eq(emailCampaigns.id, campaignId));

  return { recipientCount: subscribers.length };
}

/**
 * Send campaign to all pending recipients
 */
export async function sendCampaign(campaignId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const campaigns = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, campaignId));

  if (!campaigns || campaigns.length === 0) throw new Error('Campaign not found');
  const campaign = campaigns[0];

  // Update campaign status to sending
  await db
    .update(emailCampaigns)
    .set({ status: 'sending' })
    .where(eq(emailCampaigns.id, campaignId));

  // Get all pending recipients
  const pendingRecipients = await db.select().from(campaignRecipients).where(
    and(
      eq(campaignRecipients.campaignId, campaignId),
      eq(campaignRecipients.status, 'pending')
    )
  );

  let sentCount = 0;
  let bounceCount = 0;

  for (const recipient of pendingRecipients) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: recipient.email,
        subject: campaign.subject,
        html: campaign.htmlContent,
        text: campaign.textContent || '',
        headers: {
          'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
        },
      });

      // Update recipient status to sent
      await db
        .update(campaignRecipients)
        .set({ status: 'sent', sentAt: new Date() })
        .where(eq(campaignRecipients.id, recipient.id));

      sentCount++;
    } catch (error) {
      console.error(`Failed to send campaign email to ${recipient.email}:`, error);

      // Update recipient status to bounced
      await db
        .update(campaignRecipients)
        .set({
          status: 'bounced',
          bounceReason: (error as Error).message,
        })
        .where(eq(campaignRecipients.id, recipient.id));

      bounceCount++;
    }
  }

  // Update campaign status to sent
  await db
    .update(emailCampaigns)
    .set({
      status: 'sent',
      sentCount,
      bounceCount,
    })
    .where(eq(emailCampaigns.id, campaignId));

  return { sentCount, bounceCount, totalRecipients: pendingRecipients.length };
}

/**
 * Delete campaign (only if draft)
 */
export async function deleteCampaign(campaignId: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const campaigns = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, campaignId));

  if (!campaigns || campaigns.length === 0) throw new Error('Campaign not found');
  const campaign = campaigns[0];
  if (campaign.status !== 'draft') throw new Error('Can only delete draft campaigns');

  // Delete recipients
  await db.delete(campaignRecipients).where(eq(campaignRecipients.campaignId, campaignId));

  // Delete campaign
  await db.delete(emailCampaigns).where(eq(emailCampaigns.id, campaignId));

  return { success: true };
}
