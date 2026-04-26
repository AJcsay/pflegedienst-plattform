# Database Schema Reference - Pflegedienst Plattform

Vollständige Dokumentation aller Datenbanktabellen für Claude Code.

---

## 📋 Inhaltsverzeichnis

1. [Users](#users)
2. [Appointments](#appointments)
3. [Email Campaigns](#email-campaigns)
4. [Campaign Recipients](#campaign-recipients)
5. [Email Tracking](#email-tracking)
6. [Appointment Reminders](#appointment-reminders)
7. [Appointment Feedback](#appointment-feedback)
8. [Admin Users](#admin-users)

---

## Users

**Tabelle:** `users`

Speichert Benutzer, die sich über Manus OAuth anmelden.

```typescript
{
  id: string;                    // Primary Key (UUID)
  email: string;                 // Unique
  role: "admin" | "user";        // Default: "user"
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `email` (UNIQUE)

**Beziehungen:**
- 1:N zu `adminUsers`

---

## Appointments

**Tabelle:** `appointments`

Speichert alle Terminanfragen und Termine.

```typescript
{
  id: number;                    // Primary Key (Auto-increment)
  firstName: string;             // Required
  lastName: string;              // Required
  email: string;                 // Required
  phone: string;                 // Required
  appointmentType: string;       // Enum: "initial_consultation" | "home_visit" | "care_planning" | "follow_up"
  preferredDate: Date;           // Required
  preferredTime: string;         // Format: "HH:MM" (e.g., "10:00")
  status: string;                // Enum: "pending" | "confirmed" | "completed" | "cancelled"
  confirmedDate?: Date;          // Optional, set when confirmed
  confirmedTime?: string;        // Optional, Format: "HH:MM"
  careNeeds?: string;            // Optional, text description
  notes?: string;                // Optional, internal notes
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `email`
- `status`
- `preferredDate`
- `confirmedDate`

**Beziehungen:**
- 1:N zu `appointmentReminders`
- 1:N zu `appointmentFeedback`
- 1:N zu `emailTracking`

**Queries:**
```typescript
// Get all confirmed appointments
const confirmed = await db
  .select()
  .from(appointments)
  .where(eq(appointments.status, "confirmed"));

// Get appointments for a specific date
const byDate = await db
  .select()
  .from(appointments)
  .where(eq(appointments.confirmedDate, new Date("2026-05-01")));
```

---

## Email Campaigns

**Tabelle:** `emailCampaigns`

Speichert Email-Marketing-Kampagnen.

```typescript
{
  id: string;                    // Primary Key (UUID)
  name: string;                  // Campaign name
  subject: string;               // Email subject
  content: string;               // HTML email content
  status: string;                // Enum: "draft" | "scheduled" | "sent" | "failed"
  scheduledAt?: Date;            // When to send
  sentAt?: Date;                 // When actually sent
  recipientCount: number;        // Total recipients
  openCount: number;             // Default: 0
  clickCount: number;            // Default: 0
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `status`
- `scheduledAt`
- `sentAt`

**Beziehungen:**
- 1:N zu `campaignRecipients`
- 1:N zu `emailTracking`

**Queries:**
```typescript
// Get pending campaigns
const pending = await db
  .select()
  .from(emailCampaigns)
  .where(eq(emailCampaigns.status, "scheduled"));

// Get campaigns sent in last 30 days
const recent = await db
  .select()
  .from(emailCampaigns)
  .where(
    and(
      eq(emailCampaigns.status, "sent"),
      gte(emailCampaigns.sentAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    )
  );
```

---

## Campaign Recipients

**Tabelle:** `campaignRecipients`

Speichert Empfänger von Email-Kampagnen.

```typescript
{
  id: string;                    // Primary Key (UUID)
  campaignId: string;            // Foreign Key zu emailCampaigns
  email: string;                 // Recipient email
  status: string;                // Enum: "pending" | "sent" | "failed" | "bounced"
  sentAt?: Date;                 // When sent
  failureReason?: string;        // Error message if failed
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `campaignId`
- `email`
- `status`

**Foreign Keys:**
- `campaignId` → `emailCampaigns.id`

**Queries:**
```typescript
// Get all recipients for a campaign
const recipients = await db
  .select()
  .from(campaignRecipients)
  .where(eq(campaignRecipients.campaignId, "campaign-123"));

// Get failed sends
const failed = await db
  .select()
  .from(campaignRecipients)
  .where(eq(campaignRecipients.status, "failed"));
```

---

## Email Tracking

**Tabelle:** `emailTracking`

Speichert Email-Öffnungen und Klicks.

```typescript
{
  id: string;                    // Primary Key (UUID)
  campaignId?: string;           // Foreign Key zu emailCampaigns (optional)
  appointmentId?: string;        // Foreign Key zu appointments (optional)
  email: string;                 // Recipient email
  trackingPixelId: string;       // Unique pixel ID
  eventType: string;             // Enum: "open" | "click"
  linkUrl?: string;              // URL clicked (if click event)
  userAgent?: string;            // Browser info
  ipAddress?: string;            // IP address
  timestamp: Date;               // When event occurred
  createdAt: Date;               // Auto-set
}
```

**Indizes:**
- `campaignId`
- `appointmentId`
- `email`
- `trackingPixelId`
- `eventType`
- `timestamp`

**Foreign Keys:**
- `campaignId` → `emailCampaigns.id` (optional)
- `appointmentId` → `appointments.id` (optional)

**Queries:**
```typescript
// Get all opens for a campaign
const opens = await db
  .select()
  .from(emailTracking)
  .where(
    and(
      eq(emailTracking.campaignId, "campaign-123"),
      eq(emailTracking.eventType, "open")
    )
  );

// Get unique opens (distinct emails)
const uniqueOpens = await db
  .selectDistinct({ email: emailTracking.email })
  .from(emailTracking)
  .where(
    and(
      eq(emailTracking.campaignId, "campaign-123"),
      eq(emailTracking.eventType, "open")
    )
  );
```

---

## Appointment Reminders

**Tabelle:** `appointmentReminders`

Speichert automatische Erinnerungen für Termine.

```typescript
{
  id: string;                    // Primary Key (UUID)
  appointmentId: number;         // Foreign Key zu appointments
  reminderType: string;          // Enum: "24h_before" | "1h_before" | "day_after"
  scheduledAt: Date;             // When reminder should be sent
  sentAt?: Date;                 // When actually sent
  status: string;                // Enum: "pending" | "sent" | "failed" | "cancelled"
  failureReason?: string;        // Error message if failed
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `appointmentId`
- `status`
- `scheduledAt`
- `reminderType`

**Foreign Keys:**
- `appointmentId` → `appointments.id`

**Queries:**
```typescript
// Get pending reminders due now
const dueSoon = await db
  .select()
  .from(appointmentReminders)
  .where(
    and(
      eq(appointmentReminders.status, "pending"),
      lte(appointmentReminders.scheduledAt, new Date())
    )
  );

// Get all reminders for an appointment
const forAppointment = await db
  .select()
  .from(appointmentReminders)
  .where(eq(appointmentReminders.appointmentId, 1));

// Get reminder statistics
const stats = await db
  .select({
    total: count(),
    pending: count(sql`CASE WHEN status = 'pending' THEN 1 END`),
    sent: count(sql`CASE WHEN status = 'sent' THEN 1 END`),
    failed: count(sql`CASE WHEN status = 'failed' THEN 1 END`),
  })
  .from(appointmentReminders);
```

---

## Appointment Feedback

**Tabelle:** `appointmentFeedback`

Speichert Feedback und Bewertungen nach Terminen.

```typescript
{
  id: string;                    // Primary Key (UUID)
  appointmentId: number;         // Foreign Key zu appointments
  surveyToken: string;           // Unique token for public survey access
  rating?: number;               // 1-5 stars
  comments?: string;             // Text feedback
  careQuality?: number;          // 1-5 rating
  professionalism?: number;      // 1-5 rating
  communication?: number;        // 1-5 rating
  wouldRecommend?: boolean;      // Yes/No
  improvementSuggestions?: string; // Text suggestions
  submittedAt?: Date;            // When feedback submitted
  emailSentAt?: Date;            // When survey email sent
  status: string;                // Enum: "pending" | "viewed" | "submitted"
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `appointmentId` (UNIQUE)
- `surveyToken` (UNIQUE)
- `status`
- `submittedAt`

**Foreign Keys:**
- `appointmentId` → `appointments.id`

**Queries:**
```typescript
// Get feedback for an appointment
const feedback = await db
  .select()
  .from(appointmentFeedback)
  .where(eq(appointmentFeedback.appointmentId, 1));

// Get feedback by survey token
const bySurvey = await db
  .select()
  .from(appointmentFeedback)
  .where(eq(appointmentFeedback.surveyToken, "token-abc123"));

// Get average ratings
const avgRatings = await db
  .select({
    avgRating: avg(appointmentFeedback.rating),
    avgCareQuality: avg(appointmentFeedback.careQuality),
    avgProfessionalism: avg(appointmentFeedback.professionalism),
    avgCommunication: avg(appointmentFeedback.communication),
  })
  .from(appointmentFeedback)
  .where(eq(appointmentFeedback.status, "submitted"));

// Get recommendation rate
const recommendationRate = await db
  .select({
    recommended: count(sql`CASE WHEN wouldRecommend = true THEN 1 END`),
    total: count(),
  })
  .from(appointmentFeedback)
  .where(eq(appointmentFeedback.status, "submitted"));

// Get feedback statistics
const stats = await db
  .select({
    total: count(),
    pending: count(sql`CASE WHEN status = 'pending' THEN 1 END`),
    viewed: count(sql`CASE WHEN status = 'viewed' THEN 1 END`),
    submitted: count(sql`CASE WHEN status = 'submitted' THEN 1 END`),
  })
  .from(appointmentFeedback);
```

---

## Admin Users

**Tabelle:** `adminUsers`

Speichert Admin-Benutzer mit Authentifizierung.

```typescript
{
  id: string;                    // Primary Key (UUID)
  email: string;                 // Unique
  passwordHash: string;          // Hashed password (bcrypt)
  role: string;                  // Enum: "admin" | "owner"
  status: string;                // Enum: "active" | "inactive"
  lastLogin?: Date;              // Last login timestamp
  createdAt: Date;               // Auto-set
  updatedAt: Date;               // Auto-update
}
```

**Indizes:**
- `email` (UNIQUE)
- `status`

**Queries:**
```typescript
// Get active admins
const activeAdmins = await db
  .select()
  .from(adminUsers)
  .where(eq(adminUsers.status, "active"));

// Get admin by email
const admin = await db
  .select()
  .from(adminUsers)
  .where(eq(adminUsers.email, "admin@example.com"));

// Get all owners
const owners = await db
  .select()
  .from(adminUsers)
  .where(eq(adminUsers.role, "owner"));
```

---

## Relationships Diagram

```
users (1) ──→ (N) adminUsers
            ↓
        email

appointments (1) ──→ (N) appointmentReminders
              ├──→ (N) appointmentFeedback
              └──→ (N) emailTracking

emailCampaigns (1) ──→ (N) campaignRecipients
               ├──→ (N) emailTracking
               └──→ (1) emailTracking
```

---

## Common Queries for Claude Code

### Get Dashboard Statistics
```typescript
export async function getDashboardStats() {
  const db = await getDb();

  const appointmentStats = await db
    .select({
      total: count(),
      pending: count(sql`CASE WHEN status = 'pending' THEN 1 END`),
      confirmed: count(sql`CASE WHEN status = 'confirmed' THEN 1 END`),
      completed: count(sql`CASE WHEN status = 'completed' THEN 1 END`),
    })
    .from(appointments);

  const campaignStats = await db
    .select({
      total: count(),
      sent: count(sql`CASE WHEN status = 'sent' THEN 1 END`),
      draft: count(sql`CASE WHEN status = 'draft' THEN 1 END`),
    })
    .from(emailCampaigns);

  const feedbackStats = await db
    .select({
      total: count(),
      submitted: count(sql`CASE WHEN status = 'submitted' THEN 1 END`),
      avgRating: avg(appointmentFeedback.rating),
    })
    .from(appointmentFeedback);

  return {
    appointments: appointmentStats[0],
    campaigns: campaignStats[0],
    feedback: feedbackStats[0],
  };
}
```

### Get Upcoming Appointments
```typescript
export async function getUpcomingAppointments(days = 7) {
  const db = await getDb();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.status, "confirmed"),
        gte(appointments.confirmedDate, new Date()),
        lte(appointments.confirmedDate, futureDate)
      )
    )
    .orderBy(appointments.confirmedDate);
}
```

### Get Campaign Performance
```typescript
export async function getCampaignPerformance(campaignId: string) {
  const db = await getDb();

  const campaign = await db
    .select()
    .from(emailCampaigns)
    .where(eq(emailCampaigns.id, campaignId));

  const opens = await db
    .select({ count: count() })
    .from(emailTracking)
    .where(
      and(
        eq(emailTracking.campaignId, campaignId),
        eq(emailTracking.eventType, "open")
      )
    );

  const clicks = await db
    .select({ count: count() })
    .from(emailTracking)
    .where(
      and(
        eq(emailTracking.campaignId, campaignId),
        eq(emailTracking.eventType, "click")
      )
    );

  return {
    campaign: campaign[0],
    openRate: (opens[0].count / campaign[0].recipientCount) * 100,
    clickRate: (clicks[0].count / campaign[0].recipientCount) * 100,
  };
}
```

---

**Letzte Aktualisierung:** April 2026
**Version:** 1.0.0
