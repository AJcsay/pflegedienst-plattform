import nodemailer from 'nodemailer';
import { getDb } from './db';
import { emailCampaigns, campaignRecipients, emailTemplates, campaignAutomations, newsletterSubscribers } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { prepareEmailWithTracking, prepareTextEmailWithTracking } from './tracking-pixel-generator';

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

/**
 * Render template with variables
 */
export function renderTemplate(htmlContent: string, variables: Record<string, string>): string {
  let rendered = htmlContent;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
  }

  return rendered;
}

/**
 * Send welcome email to new newsletter subscriber with tracking
 */
export async function sendWelcomeEmail(email: string, firstName?: string, recipientId?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get welcome template
  const templates = await db.select().from(emailTemplates).where(
    and(
      eq(emailTemplates.templateType, 'welcome'),
      eq(emailTemplates.isActive, true)
    )
  );

  // Fallback: use inline default template if none found in DB
  const defaultHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px"><h2 style="color:#1a3a6b">Willkommen bei {{companyName}}!</h2><p>Hallo {{firstName}},</p><p>herzlichen Dank für Ihre Anmeldung zu unserem Newsletter!</p><p>Viele Grüße,<br>Ihr {{companyName}}-Team</p><hr><small><a href="{{unsubscribeLink}}">Abmelden</a></small></body></html>`;
  const defaultText = `Willkommen bei {{companyName}}!\n\nHallo {{firstName}},\n\nherzlichen Dank für Ihre Anmeldung zu unserem Newsletter!\n\nViele Grüße,\nIhr {{companyName}}-Team\n\nAbmelden: {{unsubscribeLink}}`;

  const template = (templates && templates.length > 0)
    ? templates[0]
    : { name: `Willkommen bei ${process.env.COMPANY_NAME || 'CuraMain'}`, htmlContent: defaultHtml, textContent: defaultText };

  if (!templates || templates.length === 0) {
    console.warn(`[Welcome Email] No active DB template found for ${email}, using inline fallback`);
  }

  // Prepare variables
  const variables: Record<string, string> = {
    firstName: firstName || 'Lieber Abonnent',
    companyName: process.env.COMPANY_NAME || 'CuraMain',
    unsubscribeLink: `${process.env.VITE_FRONTEND_URL || 'https://curamain.de'}/unsubscribe?email=${encodeURIComponent(email)}`,
  };

  // Render template
  let htmlContent = renderTemplate(template.htmlContent, variables);
  let textContent = template.textContent ? renderTemplate(template.textContent, variables) : '';

  // Inject tracking if recipientId is provided
  if (recipientId) {
    try {
      htmlContent = prepareEmailWithTracking(htmlContent, recipientId);
      textContent = prepareTextEmailWithTracking(textContent, recipientId);
      console.log(`[Welcome Email] Tracking injected for recipient ${recipientId}`);
    } catch (error) {
      console.error(`[Welcome Email] Failed to inject tracking for ${recipientId}:`, error);
      // Continue without tracking if injection fails
    }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: template.name,
      html: htmlContent,
      text: textContent,
      headers: {
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
      },
    });

    console.log(`[Welcome Email] Sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Welcome Email] Failed to send to ${email}:`, error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Trigger automation based on event
 */
export async function triggerAutomation(triggerEvent: string, subscriberId: string, context?: Record<string, string>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get active automations for this trigger event
  const automations = await db.select().from(campaignAutomations).where(
    and(
      eq(campaignAutomations.triggerEvent, triggerEvent),
      eq(campaignAutomations.isActive, true)
    )
  );

  if (!automations || automations.length === 0) {
    console.log(`[Trigger] No active automations for event: ${triggerEvent}`);
    return { triggered: 0 };
  }

  let triggeredCount = 0;

  for (const automation of automations) {
    try {
      // Get the campaign
      const campaigns = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, automation.campaignId));
      if (!campaigns || campaigns.length === 0) {
        console.warn(`[Trigger] Campaign not found: ${automation.campaignId}`);
        continue;
      }

      const campaign = campaigns[0];

      // Get subscriber
      const subscribers = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.id, subscriberId));
      if (!subscribers || subscribers.length === 0) {
        console.warn(`[Trigger] Subscriber not found: ${subscriberId}`);
        continue;
      }

      const subscriber = subscribers[0];

      // Add subscriber as recipient if not already added
      const existingRecipients = await db.select().from(campaignRecipients).where(
        and(
          eq(campaignRecipients.campaignId, campaign.id),
          eq(campaignRecipients.subscriberId, subscriberId)
        )
      );

      if (!existingRecipients || existingRecipients.length === 0) {
        await db.insert(campaignRecipients).values({
          campaignId: campaign.id,
          subscriberId,
          email: subscriber.email,
          status: 'pending',
        });
      }

      // If delay is set, schedule for later (for now, just send immediately)
      // TODO: Implement delayed sending with job queue
      if (automation.delayMinutes === 0) {
        // Send immediately
        const variables: Record<string, string> = {
          firstName: subscriber.firstName || 'Lieber Abonnent',
          companyName: process.env.COMPANY_NAME || 'CuraMain',
          ...context,
        };

        const htmlContent = renderTemplate(campaign.htmlContent, variables);
        const textContent = campaign.textContent ? renderTemplate(campaign.textContent, variables) : '';

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: subscriber.email,
          subject: campaign.subject,
          html: htmlContent,
          text: textContent,
          headers: {
            'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
          },
        });

        // Update recipient status
        await db
          .update(campaignRecipients)
          .set({ status: 'sent', sentAt: new Date() })
          .where(
            and(
              eq(campaignRecipients.campaignId, campaign.id),
              eq(campaignRecipients.subscriberId, subscriberId)
            )
          );

        console.log(`[Trigger] Automation sent for event ${triggerEvent} to ${subscriber.email}`);
        triggeredCount++;
      }
    } catch (error) {
      console.error(`[Trigger] Error processing automation ${automation.id}:`, error);
    }
  }

  return { triggered: triggeredCount };
}

/**
 * Initialize welcome email template if not exists
 */
export async function initializeWelcomeTemplate() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Check if welcome template exists
  const existing = await db.select().from(emailTemplates).where(eq(emailTemplates.templateType, 'welcome'));

  if (existing && existing.length > 0) {
    console.log('[Welcome Template] Already initialized');
    return;
  }

  // Create default welcome template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, oklch(0.35 0.18 264), oklch(0.68 0.12 192)); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; }
    .content p { margin: 15px 0; }
    .cta-button { display: inline-block; background: oklch(0.68 0.12 192); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
    .footer a { color: #68d8d6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Willkommen bei {{companyName}}!</h1>
    </div>
    <div class="content">
      <p>Hallo {{firstName}},</p>
      <p>herzlichen Dank für Ihre Anmeldung zu unserem Newsletter! Wir freuen uns, Sie bald mit wertvollen Informationen rund um professionelle Pflege und Gesundheit versorgen zu dürfen.</p>
      <p>In unserem Newsletter erhalten Sie:</p>
      <ul>
        <li>Tipps zur Gesundheitsvorsorge und Pflege</li>
        <li>Aktuelle Informationen zu unseren Leistungen</li>
        <li>Exklusive Angebote und Neuigkeiten</li>
        <li>Wertvolle Ratschläge von Pflegefachkräften</li>
      </ul>
      <p>Haben Sie Fragen zu unseren Leistungen? Wir helfen Ihnen gerne weiter!</p>
      <p>Viele Grüße,<br>Ihr {{companyName}}-Team</p>
    </div>
    <div class="footer">
      <p>Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.</p>
      <p><a href="{{unsubscribeLink}}">Abmelden</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
Willkommen bei {{companyName}}!

Hallo {{firstName}},

herzlichen Dank für Ihre Anmeldung zu unserem Newsletter! Wir freuen uns, Sie bald mit wertvollen Informationen rund um professionelle Pflege und Gesundheit versorgen zu dürfen.

In unserem Newsletter erhalten Sie:
- Tipps zur Gesundheitsvorsorge und Pflege
- Aktuelle Informationen zu unseren Leistungen
- Exklusive Angebote und Neuigkeiten
- Wertvolle Ratschläge von Pflegefachkräften

Haben Sie Fragen zu unseren Leistungen? Wir helfen Ihnen gerne weiter!

Viele Grüße,
Ihr {{companyName}}-Team

---
Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.
Abmelden: {{unsubscribeLink}}
  `.trim();

  await db.insert(emailTemplates).values({
    name: 'Willkommen bei CuraMain',
    description: 'Automatische Willkommens-Email für neue Newsletter-Abonnenten',
    templateType: 'welcome',
    htmlContent,
    textContent,
    variables: JSON.stringify(['firstName', 'companyName', 'unsubscribeLink']),
    isActive: true,
  });

  console.log('[Welcome Template] Initialized successfully');
}
