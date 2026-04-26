import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { storagePut } from "./storage";
import {
  listJobPostings, getJobPosting, createJobPosting, updateJobPosting, deleteJobPosting,
  listApplications, createApplication, updateApplicationStatus,
  listReferralRequests, createReferralRequest, updateReferralStatus,
  listCapacityInquiries, createCapacityInquiry, updateCapacityInquiryStatus,
  listContactSubmissions, createContactSubmission, updateContactStatus,
  listPartnerDocuments, createPartnerDocument, deletePartnerDocument,
  createAppointment, getAppointmentById, getAppointmentsByEmail, updateAppointmentStatus, getAllAppointments,
  createReview, getPublishedReviews, getAllReviews, approveReview, rejectReview, getReviewStats,
  subscribeToNewsletter, getNewsletterSubscribers, unsubscribeFromNewsletter, verifyNewsletterSubscriber,
} from "./db";
import { newsletterSubscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  createCampaign, getCampaign, getAllCampaigns, updateCampaign,
  addAllSubscribersAsRecipients, sendCampaign, deleteCampaign,
} from "./campaign-service-simple";
import { scheduleCampaign, rescheduleCampaign, cancelScheduledCampaign, getScheduledCampaigns, getCampaignSchedulingInfo } from "./campaign-scheduler";
import { sendWelcomeEmail, triggerAutomation, initializeWelcomeTemplate } from "./trigger-service";
import { trackEmailOpen, trackEmailClick, getCampaignAnalytics, getAllCampaignsAnalytics, getEmailPerformanceMetrics } from "./email-analytics";
import { nanoid } from "nanoid";
import { randomBytes } from "crypto";
import { sendAppointmentConfirmation, sendAdminAppointmentNotification } from "./email-service";
import { templateRouter } from "./template-router";
import { adminAuthRouter } from "./admin-auth-router";
import { getAdminUserFromToken } from "./admin-jwt-service";
import { generateAppointmentReminders, sendPendingReminders, cancelReminder, getAppointmentReminders, getReminderStats, getAllReminders } from "./appointment-reminder-service";
import { createFeedbackSurvey, getFeedbackSurveyByToken, submitFeedback, getFeedbackStats, getAppointmentFeedback, getAllFeedback } from "./feedback-survey-service";

// Admin procedure that accepts both Manus OAuth and JWT tokens
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // First try: Check if user is authenticated via Manus OAuth
  if (ctx.user?.role === "admin") {
    return next({ ctx });
  }

  // Second try: Check if user is authenticated via JWT from Authorization header
  const authHeader = ctx.req?.headers?.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  const token = authHeader.slice(7).trim();
  // Validate token format: must be a non-empty string of reasonable length
  if (token.length < 20 || token.length > 2048) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token format" });
  }
  const adminUser = await getAdminUserFromToken(token);
  if (!adminUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }

  return next({
    ctx: {
      ...ctx,
      adminUser,
      isAdminJwt: true,
    },
  });
});

export const appRouter = router({
  system: systemRouter,
  templates: templateRouter,
  adminAuth: adminAuthRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Job Postings (public + admin) ─────────────────────
  jobs: router({
    list: publicProcedure.query(() => listJobPostings(true)),
    listAll: adminProcedure.query(() => listJobPostings(false)),
    get: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getJobPosting(input.id)),
    create: adminProcedure.input(z.object({
      title: z.string().min(1),
      department: z.string().optional(),
      location: z.string().optional(),
      employmentType: z.enum(["fulltime", "parttime", "minijob", "internship"]).default("fulltime"),
      description: z.string().min(1),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await createJobPosting(input);
      return { id };
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      department: z.string().optional(),
      location: z.string().optional(),
      employmentType: z.enum(["fulltime", "parttime", "minijob", "internship"]).optional(),
      description: z.string().optional(),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
      isActive: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateJobPosting(id, data);
      return { success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteJobPosting(input.id);
      return { success: true };
    }),
  }),

  // ─── Applications (public submit + admin view) ─────────
  applications: router({
    submit: publicProcedure.input(z.object({
      jobPostingId: z.number().optional(),
      firstName: z.string().min(1).max(128),
      lastName: z.string().min(1).max(128),
      email: z.string().email().max(254),
      phone: z.string().max(64).optional(),
      message: z.string().max(5000).optional(),
      resumeBase64: z.string().max(14_000_000).optional(), // ~10 MB base64
      resumeFileName: z.string().max(255).optional(),
    })).mutation(async ({ input }) => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
      let resumeUrl: string | undefined;
      if (input.resumeBase64 && input.resumeFileName) {
        const buffer = Buffer.from(input.resumeBase64, "base64");
        if (buffer.length > MAX_FILE_SIZE) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Datei zu groß. Maximale Größe: 10 MB" });
        }
        const fileKey = `applications/${nanoid()}-${input.resumeFileName}`;
        const result = await storagePut(fileKey, buffer, "application/octet-stream");
        resumeUrl = result.url;
      }
      const id = await createApplication({
        jobPostingId: input.jobPostingId ?? null,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        message: input.message,
        resumeUrl,
        resumeFileName: input.resumeFileName,
      });
      await notifyOwner({
        title: "Neue Bewerbung eingegangen",
        content: `${input.firstName} ${input.lastName} hat sich beworben.\nE-Mail: ${input.email}\n${input.phone ? `Telefon: ${input.phone}` : ""}`,
      });
      return { id, success: true };
    }),
    list: adminProcedure.query(() => listApplications()),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "reviewing", "interview", "accepted", "rejected"]),
    })).mutation(async ({ input }) => {
      await updateApplicationStatus(input.id, input.status);
      return { success: true };
    }),
  }),

  // ─── Referral Requests (public submit + admin view) ────
  referrals: router({
    submit: publicProcedure.input(z.object({
      referrerType: z.enum(["doctor", "clinic", "hospital"]),
      institutionName: z.string().min(1),
      contactPerson: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      patientName: z.string().optional(),
      patientInsurance: z.string().optional(),
      careLevel: z.string().optional(),
      careNeeds: z.string().optional(),
      urgency: z.enum(["normal", "urgent", "emergency"]).default("normal"),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await createReferralRequest(input);
      await notifyOwner({
        title: "Neue Zuweiser-Anfrage",
        content: `${input.contactPerson} (${input.institutionName}) hat eine Patientenüberleitung angefragt.\nDringlichkeit: ${input.urgency}\nE-Mail: ${input.email}`,
      });
      return { id, success: true };
    }),
    list: adminProcedure.query(() => listReferralRequests()),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "inProgress", "completed", "declined"]),
    })).mutation(async ({ input }) => {
      await updateReferralStatus(input.id, input.status);
      return { success: true };
    }),
  }),

  // ─── Capacity Inquiries (public submit + admin view) ───
  capacity: router({
    submit: publicProcedure.input(z.object({
      institutionName: z.string().min(1),
      contactPerson: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      careType: z.string().optional(),
      region: z.string().optional(),
      numberOfPatients: z.number().optional(),
      desiredStartDate: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await createCapacityInquiry(input);
      await notifyOwner({
        title: "Neue Kapazitätsabfrage",
        content: `${input.contactPerson} (${input.institutionName}) fragt Kapazitäten an.\nPflegeart: ${input.careType || "k.A."}\nRegion: ${input.region || "k.A."}`,
      });
      return { id, success: true };
    }),
    list: adminProcedure.query(() => listCapacityInquiries()),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "responded", "closed"]),
    })).mutation(async ({ input }) => {
      await updateCapacityInquiryStatus(input.id, input.status);
      return { success: true };
    }),
  }),

  // ─── Contact Submissions (public submit + admin view) ──
  contact: router({
    submit: publicProcedure.input(z.object({
      category: z.enum(["patient", "insurance", "general"]).default("general"),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      organization: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(1),
    })).mutation(async ({ input }) => {
      const id = await createContactSubmission(input);
      const categoryLabel = input.category === "patient" ? "Patient/Angehöriger" : input.category === "insurance" ? "Krankenkasse" : "Allgemein";
      await notifyOwner({
        title: `Neue Kontaktanfrage (${categoryLabel})`,
        content: `${input.firstName} ${input.lastName}${input.organization ? ` – ${input.organization}` : ""}\nBetreff: ${input.subject || "k.A."}\nE-Mail: ${input.email}`,
      });
      return { id, success: true };
    }),
    list: adminProcedure.query(() => listContactSubmissions()),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["new", "read", "replied", "closed"]),
    })).mutation(async ({ input }) => {
      await updateContactStatus(input.id, input.status);
      return { success: true };
    }),
  }),

  // ─── Appointments (Terminbuchungen) ────────────────────
  appointments: router({
    book: publicProcedure.input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      appointmentType: z.enum(["initial_consultation", "home_visit", "care_planning", "follow_up"]).default("initial_consultation"),
      preferredDate: z.date(),
      preferredTime: z.string().optional(),
      careGrade: z.string().optional(),
      careNeeds: z.string().optional(),
      notes: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await createAppointment({
        ...input,
        status: "pending",
      });
      
      // Versende Bestätigungsemail an den Benutzer
      await sendAppointmentConfirmation({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        appointmentType: input.appointmentType,
        preferredDate: input.preferredDate,
        careNeeds: input.careNeeds,
      });
      
      // Versende Admin-Benachrichtigung
      await sendAdminAppointmentNotification({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        appointmentType: input.appointmentType,
        preferredDate: input.preferredDate,
        careNeeds: input.careNeeds,
      });
      
      // Benachrichtige Owner über Manus-System
      await notifyOwner({
        title: "Neue Terminbuchung",
        content: `${input.firstName} ${input.lastName} hat einen Termin für ${input.appointmentType} am ${input.preferredDate.toLocaleDateString('de-DE')} gebucht.\n\nKontakt: ${input.email}, ${input.phone}`,
      });
      return { id, success: true };
    }),
    getByEmail: publicProcedure.input(z.object({ email: z.string().email() })).query(({ input }) => getAppointmentsByEmail(input.email)),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getAppointmentById(input.id)),
    listAll: adminProcedure.query(() => getAllAppointments()),
    updateStatus: adminProcedure.input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled", "rescheduled"]),
      confirmedDate: z.date().optional(),
      confirmedTime: z.string().optional(),
    })).mutation(async ({ input }) => {
      await updateAppointmentStatus(input.id, input.status, input.confirmedDate, input.confirmedTime);
      return { success: true };
    }),
  }),

  // ─── Reviews (Bewertungen) ────────────────────────────
  reviews: router({
    submit: publicProcedure.input(z.object({
      patientName: z.string().min(1),
      patientEmail: z.string().email(),
      rating: z.number().min(1).max(5),
      title: z.string().min(1),
      content: z.string().min(10),
      serviceType: z.string().optional(),
    })).mutation(async ({ input }) => {
      const id = await createReview({
        patientName: input.patientName,
        patientEmail: input.patientEmail,
        rating: input.rating,
        title: input.title,
        content: input.content,
        serviceType: input.serviceType,
        isApproved: false,
        isPublished: false,
      });
      
      // Notify admin of new review
      await notifyOwner({
        title: "Neue Bewertung eingereicht",
        content: `${input.patientName} hat eine ${input.rating}-Stern-Bewertung hinterlassen: "${input.title}"\n\nBitte überprüfen Sie die Bewertung im Admin-Dashboard.`,
      });
      
      // Track in Google Analytics
      return { id, success: true };
    }),
    getPublished: publicProcedure.query(() => getPublishedReviews()),
    getStats: publicProcedure.query(() => getReviewStats()),
    listAll: adminProcedure.query(() => getAllReviews()),
    approve: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      await approveReview(input.id);
      return { success: true };
    }),
    reject: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
      await rejectReview(input.id);
      return { success: true };
    }),
  }),

  // ─── Newsletter Subscribers ────────────────────────────
  newsletter: router({
    subscribe: publicProcedure.input(z.object({
      email: z.string().email(),
      firstName: z.string().optional(),
    })).mutation(async ({ input }) => {
      // Use cryptographically secure 256-bit tokens instead of nanoid
      const verificationToken = randomBytes(32).toString("hex");
      const unsubscribeToken = randomBytes(32).toString("hex");
      const result = await subscribeToNewsletter({
        email: input.email,
        firstName: input.firstName,
        isSubscribed: true,
        isVerified: false,
        verificationToken,
        unsubscribeToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      
      await notifyOwner({
        title: "Neue Newsletter-Anmeldung",
        content: `${input.email} hat sich für den Newsletter angemeldet.`,
      });
      
      return { success: true, message: "Bitte überprüfen Sie Ihr Email-Postfach zur Bestätigung." };
    }),
    unsubscribe: publicProcedure.input(z.object({
      email: z.string().email(),
    })).mutation(async ({ input }) => {
      await unsubscribeFromNewsletter(input.email);
      return { success: true, message: "Sie wurden vom Newsletter abgemeldet." };
    }),
    verify: publicProcedure.input(z.object({
      email: z.string().email(),
    })).mutation(async ({ input }) => {
      const result = await verifyNewsletterSubscriber(input.email);
      
      // Initialize welcome template on first verification
      try {
        await initializeWelcomeTemplate();
      } catch (error) {
        console.error('[Newsletter Verify] Failed to initialize welcome template:', error);
      }
      
      // Send welcome email after verification with tracking
      try {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (db) {
          const subscriber = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, input.email));
          if (subscriber && subscriber.length > 0) {
            // Pass subscriber ID for tracking pixel injection
            const subscriberId = subscriber[0].id;
            await sendWelcomeEmail(input.email, subscriber[0].firstName || undefined, subscriberId);
            console.log(`[Newsletter Verify] Welcome email sent to ${input.email} with tracking ID ${subscriberId}`);
          }
        }
      } catch (error) {
        console.error('[Newsletter Verify] Failed to send welcome email:', error);
      }

      // Trigger automation for newsletter_signup event
      try {
        if (result && typeof result === 'object' && 'id' in result) {
          await triggerAutomation('newsletter_signup', (result as any).id);
        }
      } catch (error) {
        console.error('[Newsletter Verify] Failed to trigger automation:', error);
      }
      
      return { success: true, message: "Ihre Email-Adresse wurde bestätigt!" };
    }),
    list: adminProcedure.query(() => getNewsletterSubscribers()),
    initWelcomeTemplate: adminProcedure.mutation(async () => {
      try {
        await initializeWelcomeTemplate();
        return { success: true, message: "Welcome-Template wurde initialisiert" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  }),

  // ─── Partner Documents (public list + admin manage) ────
  documents: router({
    list: publicProcedure.query(() => listPartnerDocuments(true)),
    listAll: adminProcedure.query(() => listPartnerDocuments(false)),
    upload: adminProcedure.input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().max(2000).optional(),
      fileBase64: z.string().max(70_000_000), // ~50 MB base64
      fileName: z.string().max(255),
      fileSize: z.number().optional(),
      category: z.enum(["quality", "supply", "contract", "other"]).default("other"),
    })).mutation(async ({ input }) => {
      const MAX_DOC_SIZE = 50 * 1024 * 1024; // 50 MB
      const buffer = Buffer.from(input.fileBase64, "base64");
      if (buffer.length > MAX_DOC_SIZE) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Datei zu groß. Maximale Größe: 50 MB" });
      }
      const fileKey = `partner-documents/${nanoid()}-${input.fileName}`;
      const result = await storagePut(fileKey, buffer, "application/octet-stream");
      const id = await createPartnerDocument({
        title: input.title,
        description: input.description,
        fileUrl: result.url,
        fileKey,
        fileName: input.fileName,
        fileSize: input.fileSize,
        category: input.category,
      });
      return { id, success: true };
    }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deletePartnerDocument(input.id);
      return { success: true };
    }),
  }),

  // ─── Email Campaigns (admin only) ──────────────────────
  campaigns: router({
    create: adminProcedure.input(z.object({
      name: z.string().min(1),
      subject: z.string().min(1),
      preheader: z.string().min(1),
      htmlContent: z.string().min(1),
      textContent: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id || ctx.adminUser?.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      await createCampaign(input, userId);
      return { success: true };
    }),
    list: adminProcedure.query(() => getAllCampaigns()),
    get: adminProcedure.input(z.object({ id: z.string() })).query(({ input }) => getCampaign(input.id)),
    update: adminProcedure.input(z.object({
      id: z.string(),
      name: z.string().optional(),
      subject: z.string().optional(),
      preheader: z.string().optional(),
      htmlContent: z.string().optional(),
      textContent: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCampaign(id, data);
      return { success: true };
    }),
    addSubscribers: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).mutation(async ({ input }) => {
      const result = await addAllSubscribersAsRecipients(input.campaignId);
      return result;
    }),
    send: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).mutation(async ({ input }) => {
      const result = await sendCampaign(input.campaignId);
      await notifyOwner({
        title: "Email-Kampagne versendet",
        content: `Kampagne wurde erfolgreich versendet.\nVersendet: ${result.sentCount}\nBounces: ${result.bounceCount}\nGesamt: ${result.totalRecipients}`,
      });
      return result;
    }),
    delete: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).mutation(async ({ input }) => {
      await deleteCampaign(input.campaignId);
      return { success: true };
    }),
    schedule: adminProcedure.input(z.object({
      campaignId: z.string(),
      scheduledAt: z.date(),
    })).mutation(async ({ input }) => {
      const result = await scheduleCampaign(input.campaignId, input.scheduledAt);
      if (result.success) {
        await notifyOwner({
          title: "Email-Kampagne geplant",
          content: `Kampagne wurde zeitgesteuert geplant für: ${input.scheduledAt.toLocaleString('de-DE')}`,
        });
      }
      return result;
    }),
    reschedule: adminProcedure.input(z.object({
      campaignId: z.string(),
      newScheduledAt: z.date(),
    })).mutation(async ({ input }) => {
      const result = await rescheduleCampaign(input.campaignId, input.newScheduledAt);
      if (result.success) {
        await notifyOwner({
          title: "Email-Kampagne neu geplant",
          content: `Kampagne wurde neu geplant für: ${input.newScheduledAt.toLocaleString('de-DE')}`,
        });
      }
      return result;
    }),
    cancel: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).mutation(async ({ input }) => {
      const result = await cancelScheduledCampaign(input.campaignId);
      if (result.success) {
        await notifyOwner({
          title: "Geplante Email-Kampagne abgebrochen",
          content: "Die zeitgesteuerte Kampagne wurde abgebrochen.",
        });
      }
      return result;
    }),
    listScheduled: adminProcedure.query(async () => {
      return await getScheduledCampaigns();
    }),
    getSchedulingInfo: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).query(async ({ input }) => {
      return await getCampaignSchedulingInfo(input.campaignId);
    }),
  }),

  analytics: router({
    campaignMetrics: adminProcedure.input(z.object({
      campaignId: z.string(),
    })).query(async ({ input }) => {
      try {
        return await getCampaignAnalytics(input.campaignId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    allCampaignsMetrics: adminProcedure.query(async () => {
      try {
        return await getAllCampaignsAnalytics();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    performanceMetrics: adminProcedure.query(async () => {
      try {
        return await getEmailPerformanceMetrics();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  }),
  reminders: router({
    listAll: adminProcedure.query(async () => {
      try {
        return await getAllReminders();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    generate: adminProcedure.mutation(async () => {
      try {
        return await generateAppointmentReminders();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    sendPending: adminProcedure.mutation(async () => {
      try {
        return await sendPendingReminders();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    cancel: adminProcedure.input(z.object({ reminderId: z.string() })).mutation(async ({ input }) => {
      try {
        return await cancelReminder(input.reminderId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    getForAppointment: adminProcedure.input(z.object({ appointmentId: z.number() })).query(async ({ input }) => {
      try {
        return await getAppointmentReminders(input.appointmentId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    stats: adminProcedure.query(async () => {
      try {
        return await getReminderStats();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  }),
  feedback: router({
    create: adminProcedure.input(z.object({ appointmentId: z.number() })).mutation(async ({ input }) => {
      try {
        return await createFeedbackSurvey(input.appointmentId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    getByToken: publicProcedure.input(z.object({ surveyToken: z.string() })).query(async ({ input }) => {
      try {
        return await getFeedbackSurveyByToken(input.surveyToken);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        });
      }
    }),
    submit: publicProcedure.input(z.object({
      surveyToken: z.string(),
      rating: z.number().min(1).max(5),
      comments: z.string().optional(),
      careQuality: z.number().min(1).max(5).optional(),
      professionalism: z.number().min(1).max(5).optional(),
      communication: z.number().min(1).max(5).optional(),
      wouldRecommend: z.boolean().optional(),
      improvementSuggestions: z.string().optional(),
    })).mutation(async ({ input }) => {
      try {
        const { surveyToken, ...feedback } = input;
        return await submitFeedback(surveyToken, feedback);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: (error as Error).message,
        });
      }
    }),
    stats: adminProcedure.query(async () => {
      try {
        return await getFeedbackStats();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    getForAppointment: adminProcedure.input(z.object({ appointmentId: z.number() })).query(async ({ input }) => {
      try {
        return await getAppointmentFeedback(input.appointmentId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
    getAll: adminProcedure.query(async () => {
      try {
        return await getAllFeedback();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
