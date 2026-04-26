# tRPC API Reference - Pflegedienst Plattform

Vollständige Dokumentation aller verfügbaren tRPC-Prozeduren für Claude Code.

---

## 📋 Inhaltsverzeichnis

1. [Authentication](#authentication)
2. [Appointments](#appointments)
3. [Email Campaigns](#email-campaigns)
4. [Appointment Reminders](#appointment-reminders)
5. [Feedback Surveys](#feedback-surveys)
6. [Admin Users](#admin-users)
7. [System](#system)

---

## Authentication

### `auth.me`
**Type:** `publicProcedure.query`

Gibt den aktuellen Benutzer zurück (oder null wenn nicht angemeldet).

```typescript
const { data: user } = trpc.auth.me.useQuery();
// user: { id, email, role, createdAt } | null
```

### `auth.logout`
**Type:** `protectedProcedure.mutation`

Meldet den aktuellen Benutzer ab.

```typescript
const logout = trpc.auth.logout.useMutation();
await logout.mutateAsync();
```

---

## Appointments

### `appointments.list`
**Type:** `publicProcedure.query`

Listet alle Termine auf.

```typescript
const { data: appointments } = trpc.appointments.list.useQuery();
// appointments: Appointment[]
```

**Appointment Schema:**
```typescript
{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appointmentType: "initial_consultation" | "home_visit" | "care_planning" | "follow_up";
  preferredDate: Date;
  preferredTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  confirmedDate?: Date;
  confirmedTime?: string;
  careNeeds?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `appointments.create`
**Type:** `publicProcedure.mutation`

Erstellt einen neuen Termin.

```typescript
const create = trpc.appointments.create.useMutation();

await create.mutateAsync({
  firstName: "Max",
  lastName: "Mustermann",
  email: "max@example.com",
  phone: "123-456-7890",
  appointmentType: "initial_consultation",
  preferredDate: new Date("2026-05-01"),
  preferredTime: "10:00",
  careNeeds: "Wundreinigung",
});
```

### `appointments.update`
**Type:** `adminProcedure.mutation`

Aktualisiert einen Termin.

```typescript
const update = trpc.appointments.update.useMutation();

await update.mutateAsync({
  id: 1,
  status: "confirmed",
  confirmedDate: new Date("2026-05-01"),
  confirmedTime: "10:00",
});
```

### `appointments.getById`
**Type:** `publicProcedure.query`

Ruft einen spezifischen Termin ab.

```typescript
const { data: appointment } = trpc.appointments.getById.useQuery({ id: 1 });
```

### `appointments.delete`
**Type:** `adminProcedure.mutation`

Löscht einen Termin.

```typescript
const delete_ = trpc.appointments.delete.useMutation();
await delete_.mutateAsync({ id: 1 });
```

---

## Email Campaigns

### `campaigns.list`
**Type:** `adminProcedure.query`

Listet alle Email-Kampagnen auf.

```typescript
const { data: campaigns } = trpc.campaigns.list.useQuery();
```

**Campaign Schema:**
```typescript
{
  id: string;
  name: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### `campaigns.create`
**Type:** `adminProcedure.mutation`

Erstellt eine neue Kampagne.

```typescript
const create = trpc.campaigns.create.useMutation();

await create.mutateAsync({
  name: "Newsletter Mai 2026",
  subject: "Neue Pflegedienstleistungen",
  content: "<h1>Willkommen</h1>...",
  scheduledAt: new Date("2026-05-01T09:00:00"),
});
```

### `campaigns.send`
**Type:** `adminProcedure.mutation`

Versendet eine Kampagne sofort.

```typescript
const send = trpc.campaigns.send.useMutation();
await send.mutateAsync({ campaignId: "campaign-123" });
```

### `campaigns.delete`
**Type:** `adminProcedure.mutation`

Löscht eine Kampagne.

```typescript
const delete_ = trpc.campaigns.delete.useMutation();
await delete_.mutateAsync({ campaignId: "campaign-123" });
```

### `campaigns.getAnalytics`
**Type:** `adminProcedure.query`

Ruft Analytics für eine Kampagne ab.

```typescript
const { data: analytics } = trpc.campaigns.getAnalytics.useQuery({
  campaignId: "campaign-123",
});
// analytics: { opens, clicks, bounces, conversions }
```

---

## Appointment Reminders

### `reminders.generate`
**Type:** `adminProcedure.mutation`

Generiert Reminders für kommende Termine.

```typescript
const generate = trpc.reminders.generate.useMutation();
const result = await generate.mutateAsync();
// result: { generated: number }
```

### `reminders.sendPending`
**Type:** `adminProcedure.mutation`

Versendet ausstehende Reminders.

```typescript
const sendPending = trpc.reminders.sendPending.useMutation();
const result = await sendPending.mutateAsync();
// result: { sent: number, failed: number }
```

### `reminders.cancel`
**Type:** `adminProcedure.mutation`

Storniert einen Reminder.

```typescript
const cancel = trpc.reminders.cancel.useMutation();
await cancel.mutateAsync({ reminderId: "reminder-123" });
```

### `reminders.getForAppointment`
**Type:** `adminProcedure.query`

Ruft Reminders für einen Termin ab.

```typescript
const { data: reminders } = trpc.reminders.getForAppointment.useQuery({
  appointmentId: 1,
});
```

**Reminder Schema:**
```typescript
{
  id: string;
  appointmentId: number;
  reminderType: "24h_before" | "1h_before" | "day_after";
  scheduledAt: Date;
  sentAt?: Date;
  status: "pending" | "sent" | "failed" | "cancelled";
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### `reminders.stats`
**Type:** `adminProcedure.query`

Ruft Reminder-Statistiken ab.

```typescript
const { data: stats } = trpc.reminders.stats.useQuery();
// stats: { total, pending, sent, failed, cancelled }
```

---

## Feedback Surveys

### `feedback.create`
**Type:** `adminProcedure.mutation`

Erstellt eine Feedback-Umfrage für einen Termin.

```typescript
const create = trpc.feedback.create.useMutation();
const survey = await create.mutateAsync({ appointmentId: 1 });
// survey: { appointmentId, surveyToken, status }
```

### `feedback.getByToken`
**Type:** `publicProcedure.query`

Ruft eine Umfrage anhand des Tokens ab (öffentlich zugänglich).

```typescript
const { data: survey } = trpc.feedback.getByToken.useQuery({
  surveyToken: "token-abc123",
});
```

**Survey Schema:**
```typescript
{
  id: string;
  appointmentId: number;
  surveyToken: string;
  rating?: number; // 1-5
  comments?: string;
  careQuality?: number; // 1-5
  professionalism?: number; // 1-5
  communication?: number; // 1-5
  wouldRecommend?: boolean;
  improvementSuggestions?: string;
  status: "pending" | "viewed" | "submitted";
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### `feedback.submit`
**Type:** `publicProcedure.mutation`

Reicht Feedback ein.

```typescript
const submit = trpc.feedback.submit.useMutation();

await submit.mutateAsync({
  surveyToken: "token-abc123",
  rating: 5,
  comments: "Sehr zufrieden!",
  careQuality: 5,
  professionalism: 5,
  communication: 5,
  wouldRecommend: true,
  improvementSuggestions: "Alles perfekt",
});
```

### `feedback.stats`
**Type:** `adminProcedure.query`

Ruft Feedback-Statistiken ab.

```typescript
const { data: stats } = trpc.feedback.stats.useQuery();
// stats: {
//   total,
//   pending,
//   viewed,
//   submitted,
//   averageRating,
//   recommendationRate,
// }
```

### `feedback.getForAppointment`
**Type:** `adminProcedure.query`

Ruft Feedback für einen Termin ab.

```typescript
const { data: feedback } = trpc.feedback.getForAppointment.useQuery({
  appointmentId: 1,
});
```

### `feedback.getAll`
**Type:** `adminProcedure.query`

Ruft alle Feedback-Einträge ab.

```typescript
const { data: allFeedback } = trpc.feedback.getAll.useQuery();
```

---

## Admin Users

### `adminUsers.list`
**Type:** `adminProcedure.query`

Listet alle Admin-Benutzer auf.

```typescript
const { data: users } = trpc.adminUsers.list.useQuery();
```

**AdminUser Schema:**
```typescript
{
  id: string;
  email: string;
  role: "admin" | "owner";
  status: "active" | "inactive";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### `adminUsers.create`
**Type:** `adminProcedure.mutation`

Erstellt einen neuen Admin-Benutzer.

```typescript
const create = trpc.adminUsers.create.useMutation();

await create.mutateAsync({
  email: "admin@example.com",
  password: "SecurePassword123!",
  role: "admin",
});
```

### `adminUsers.updateRole`
**Type:** `adminProcedure.mutation`

Aktualisiert die Rolle eines Benutzers.

```typescript
const updateRole = trpc.adminUsers.updateRole.useMutation();

await updateRole.mutateAsync({
  userId: "user-123",
  role: "owner",
});
```

### `adminUsers.toggleStatus`
**Type:** `adminProcedure.mutation`

Aktiviert/Deaktiviert einen Benutzer.

```typescript
const toggle = trpc.adminUsers.toggleStatus.useMutation();

await toggle.mutateAsync({
  userId: "user-123",
  status: "inactive",
});
```

---

## System

### `system.notifyOwner`
**Type:** `protectedProcedure.mutation`

Sendet eine Benachrichtigung an den Projekt-Owner.

```typescript
const notify = trpc.system.notifyOwner.useMutation();

await notify.mutateAsync({
  title: "Neue Bewerbung eingegangen",
  content: "Max Mustermann hat sich für einen Termin angemeldet.",
});
```

---

## Error Handling

Alle tRPC-Prozeduren können folgende Fehler zurückgeben:

```typescript
import { TRPCError } from "@trpc/server";

// Fehlertypen
"PARSE_ERROR" // Input-Validierung fehlgeschlagen
"BAD_REQUEST" // Ungültige Anfrage
"UNAUTHORIZED" // Nicht angemeldet
"FORBIDDEN" // Keine Berechtigung
"NOT_FOUND" // Ressource nicht gefunden
"CONFLICT" // Konflikt (z.B. Email bereits vorhanden)
"INTERNAL_SERVER_ERROR" // Server-Fehler
```

**Frontend Error-Handling:**
```typescript
const mutation = trpc.appointments.create.useMutation({
  onError: (error) => {
    if (error.data?.code === "CONFLICT") {
      console.error("Email already exists");
    }
  },
});
```

---

## Optimistic Updates

Für bessere UX können Optimistic Updates verwendet werden:

```typescript
const mutation = trpc.appointments.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing fetches
    await trpc.useUtils().appointments.list.cancel();
    
    // Snapshot old data
    const previousData = trpc.useUtils().appointments.list.getData();
    
    // Optimistically update cache
    trpc.useUtils().appointments.list.setData(undefined, (old) => [
      ...(old || []),
      newData,
    ]);
    
    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    trpc.useUtils().appointments.list.setData(
      undefined,
      context?.previousData
    );
  },
  onSuccess: () => {
    // Invalidate and refetch
    trpc.useUtils().appointments.list.invalidate();
  },
});
```

---

## Pagination Pattern

Für große Datenmengen:

```typescript
// In server/routers.ts
appointments: router({
  list: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const items = await db.select().from(appointments).limit(input.limit).offset(offset);
      const total = await db.select({ count: count() }).from(appointments);
      return { items, total: total[0].count, page: input.page };
    }),
}),
```

**Frontend:**
```typescript
const [page, setPage] = useState(1);
const { data } = trpc.appointments.list.useQuery({ page, limit: 20 });
```

---

**Letzte Aktualisierung:** April 2026
**Version:** 1.0.0
