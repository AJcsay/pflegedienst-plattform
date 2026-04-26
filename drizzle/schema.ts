import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { longtext, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 254 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Admin-Benutzer (Email/Passwort-Login)
export const adminUsers = mysqlTable("adminUsers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["admin", "owner"]).default("admin").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

// Stellenanzeigen
export const jobPostings = mysqlTable("jobPostings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 128 }),
  location: varchar("location", { length: 255 }),
  employmentType: mysqlEnum("employmentType", ["fulltime", "parttime", "minijob", "internship"]).default("fulltime").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = typeof jobPostings.$inferInsert;

// Bewerbungen
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobPostingId: int("jobPostingId"),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  message: text("message"),
  resumeUrl: text("resumeUrl"),
  resumeFileName: varchar("resumeFileName", { length: 255 }),
  status: mysqlEnum("status", ["new", "reviewing", "interview", "accepted", "rejected"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// Zuweiser-Anfragen (Ärzte & Kliniken)
export const referralRequests = mysqlTable("referralRequests", {
  id: int("id").autoincrement().primaryKey(),
  referrerType: mysqlEnum("referrerType", ["doctor", "clinic", "hospital"]).notNull(),
  institutionName: varchar("institutionName", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  patientName: varchar("patientName", { length: 255 }),
  patientInsurance: varchar("patientInsurance", { length: 255 }),
  careLevel: varchar("careLevel", { length: 64 }),
  careNeeds: text("careNeeds"),
  urgency: mysqlEnum("urgency", ["normal", "urgent", "emergency"]).default("normal").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["new", "inProgress", "completed", "declined"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReferralRequest = typeof referralRequests.$inferSelect;
export type InsertReferralRequest = typeof referralRequests.$inferInsert;

// Kapazitätsabfragen
export const capacityInquiries = mysqlTable("capacityInquiries", {
  id: int("id").autoincrement().primaryKey(),
  institutionName: varchar("institutionName", { length: 255 }).notNull(),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  careType: varchar("careType", { length: 128 }),
  region: varchar("region", { length: 255 }),
  numberOfPatients: int("numberOfPatients"),
  desiredStartDate: varchar("desiredStartDate", { length: 64 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["new", "responded", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CapacityInquiry = typeof capacityInquiries.$inferSelect;
export type InsertCapacityInquiry = typeof capacityInquiries.$inferInsert;

// Kontaktanfragen (allgemein + Patienten + Krankenkassen)
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  category: mysqlEnum("category", ["patient", "insurance", "general"]).default("general").notNull(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  organization: varchar("organization", { length: 255 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Partner-Dokumente (Qualitäts- und Versorgungsunterlagen)
export const partnerDocuments = mysqlTable("partnerDocuments", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("fileUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize"),
  category: mysqlEnum("category", ["quality", "supply", "contract", "other"]).default("other").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PartnerDocument = typeof partnerDocuments.$inferSelect;
export type InsertPartnerDocument = typeof partnerDocuments.$inferInsert;

// Terminbuchungen
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 128 }).notNull(),
  lastName: varchar("lastName", { length: 128 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 64 }).notNull(),
  appointmentType: mysqlEnum("appointmentType", ["initial_consultation", "home_visit", "care_planning", "follow_up"]).default("initial_consultation").notNull(),
  preferredDate: timestamp("preferredDate").notNull(),
  preferredTime: varchar("preferredTime", { length: 64 }),
  careGrade: varchar("careGrade", { length: 64 }),
  careNeeds: text("careNeeds"),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled", "rescheduled"]).default("pending").notNull(),
  confirmedDate: timestamp("confirmedDate"),
  confirmedTime: varchar("confirmedTime", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Bewertungen und Testimonials
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  patientName: varchar("patientName", { length: 128 }).notNull(),
  patientEmail: varchar("patientEmail", { length: 254 }).notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  serviceType: varchar("serviceType", { length: 128 }),
  isApproved: boolean("isApproved").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Newsletter-Abonnenten
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  email: varchar("email", { length: 254 }).notNull().unique(),
  firstName: varchar("firstName", { length: 128 }),
  isSubscribed: boolean("isSubscribed").default(true).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  verificationTokenExpiresAt: timestamp("verificationTokenExpiresAt"),
  unsubscribeToken: varchar("unsubscribeToken", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("newsletterSubscribers_verified_subscribed_idx").on(table.isVerified, table.isSubscribed),
]);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Email-Kampagnen
export const emailCampaigns = mysqlTable("emailCampaigns", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  preheader: varchar("preheader", { length: 255 }),
  htmlContent: text("htmlContent").notNull(),
  textContent: text("textContent"),
  campaignType: mysqlEnum("campaignType", ["welcome", "reminder", "promotion", "educational", "feedback", "custom"]).default("custom").notNull(),
  triggerType: mysqlEnum("triggerType", ["manual", "scheduled", "event_based"]).default("manual").notNull(),
  triggerEvent: varchar("triggerEvent", { length: 128 }), // e.g., "newsletter_signup", "appointment_booked"
  scheduledAt: timestamp("scheduledAt"),
  status: mysqlEnum("status", ["draft", "scheduled", "sending", "sent", "paused", "cancelled"]).default("draft").notNull(),
  recipientCount: int("recipientCount").default(0),
  sentCount: int("sentCount").default(0),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  unsubscribeCount: int("unsubscribeCount").default(0),
  bounceCount: int("bounceCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy"),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = typeof emailCampaigns.$inferInsert;

// Email-Kampagnen-Empfänger
export const campaignRecipients = mysqlTable("campaignRecipients", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  campaignId: varchar("campaignId", { length: 36 }).notNull(),
  subscriberId: varchar("subscriberId", { length: 36 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "opened", "clicked", "bounced", "unsubscribed"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  bounceReason: text("bounceReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("campaignRecipients_campaignId_idx").on(table.campaignId),
  index("campaignRecipients_subscriberId_idx").on(table.subscriberId),
]);

export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type InsertCampaignRecipient = typeof campaignRecipients.$inferInsert;

// Email-Kampagnen-Vorlagen
export const emailTemplates = mysqlTable("emailTemplates", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  templateType: mysqlEnum("templateType", ["welcome", "reminder", "promotion", "educational", "feedback", "custom"]).default("custom").notNull(),
  htmlContent: text("htmlContent").notNull(),
  textContent: text("textContent"),
  variables: text("variables"), // e.g., ["firstName", "appointmentDate", "serviceType"]
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy"),
});

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

// Email-Kampagnen-Automatisierung (Automation Rules)
export const campaignAutomations = mysqlTable("campaignAutomations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  triggerEvent: varchar("triggerEvent", { length: 128 }).notNull(), // e.g., "newsletter_signup", "appointment_booked"
  campaignId: varchar("campaignId", { length: 36 }).notNull(),
  delayMinutes: int("delayMinutes").default(0), // Delay before sending
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy"),
});

export type CampaignAutomation = typeof campaignAutomations.$inferSelect;
export type InsertCampaignAutomation = typeof campaignAutomations.$inferInsert;

// Password Reset Tokens für Admin-Benutzer
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// Appointment Reminders (für Erinnerungs-Emails)
export const appointmentReminders = mysqlTable("appointmentReminders", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  appointmentId: int("appointmentId").notNull(),
  reminderType: mysqlEnum("reminderType", ["24h_before", "1h_before", "day_after"]).notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  sentAt: timestamp("sentAt"),
  status: mysqlEnum("status", ["pending", "sent", "failed", "cancelled"]).default("pending").notNull(),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("appointmentReminders_appointmentId_idx").on(table.appointmentId),
  index("appointmentReminders_status_scheduledAt_idx").on(table.status, table.scheduledAt),
]);

export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
export type InsertAppointmentReminder = typeof appointmentReminders.$inferInsert;

// Appointment Feedback Surveys (für Post-Appointment-Feedback)
export const appointmentFeedback = mysqlTable("appointmentFeedback", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`UUID()`),
  appointmentId: int("appointmentId").notNull(),
  surveyToken: varchar("surveyToken", { length: 255 }).notNull().unique(),
  rating: int("rating"), // 1-5 stars
  comments: text("comments"),
  careQuality: int("careQuality"), // 1-5
  professionalism: int("professionalism"), // 1-5
  communication: int("communication"), // 1-5
  wouldRecommend: boolean("wouldRecommend"),
  improvementSuggestions: text("improvementSuggestions"),
  submittedAt: timestamp("submittedAt"),
  emailSentAt: timestamp("emailSentAt"),
  status: mysqlEnum("status", ["pending", "sent", "viewed", "submitted"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AppointmentFeedback = typeof appointmentFeedback.$inferSelect;
export type InsertAppointmentFeedback = typeof appointmentFeedback.$inferInsert;
