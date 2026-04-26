import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  jobPostings, InsertJobPosting,
  applications, InsertApplication,
  referralRequests, InsertReferralRequest,
  capacityInquiries, InsertCapacityInquiry,
  contactSubmissions, InsertContactSubmission,
  partnerDocuments, InsertPartnerDocument,
  appointments, InsertAppointment,
  reviews, InsertReview, Review,
  newsletterSubscribers, InsertNewsletterSubscriber, NewsletterSubscriber,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Job Postings ────────────────────────────────────────
export async function listJobPostings(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(jobPostings).where(eq(jobPostings.isActive, true)).orderBy(desc(jobPostings.createdAt));
  }
  return db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
}

export async function getJobPosting(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
  return result[0];
}

export async function createJobPosting(data: InsertJobPosting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobPostings).values(data);
  return result[0].insertId;
}

export async function updateJobPosting(id: number, data: Partial<InsertJobPosting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(jobPostings).set(data).where(eq(jobPostings.id, id));
}

export async function deleteJobPosting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(jobPostings).where(eq(jobPostings.id, id));
}

// ─── Applications ────────────────────────────────────────
export async function listApplications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(applications).orderBy(desc(applications.createdAt));
}

export async function createApplication(data: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(applications).values(data);
  return result[0].insertId;
}

export async function updateApplicationStatus(
  id: number,
  status: "new" | "reviewing" | "interview" | "accepted" | "rejected"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(applications).set({ status }).where(eq(applications.id, id));
}

// ─── Referral Requests ───────────────────────────────────
export async function listReferralRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referralRequests).orderBy(desc(referralRequests.createdAt));
}

export async function createReferralRequest(data: InsertReferralRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(referralRequests).values(data);
  return result[0].insertId;
}

export async function updateReferralStatus(
  id: number,
  status: "new" | "inProgress" | "completed" | "declined"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(referralRequests).set({ status }).where(eq(referralRequests.id, id));
}

// ─── Capacity Inquiries ──────────────────────────────────
export async function listCapacityInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(capacityInquiries).orderBy(desc(capacityInquiries.createdAt));
}

export async function createCapacityInquiry(data: InsertCapacityInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(capacityInquiries).values(data);
  return result[0].insertId;
}

export async function updateCapacityInquiryStatus(
  id: number,
  status: "new" | "responded" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(capacityInquiries).set({ status }).where(eq(capacityInquiries.id, id));
}

// ─── Contact Submissions ─────────────────────────────────
export async function listContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
}

export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactSubmissions).values(data);
  return result[0].insertId;
}

export async function updateContactStatus(
  id: number,
  status: "new" | "read" | "replied" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
}

// ─── Partner Documents ───────────────────────────────────
export async function listPartnerDocuments(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(partnerDocuments).where(eq(partnerDocuments.isActive, true)).orderBy(desc(partnerDocuments.createdAt));
  }
  return db.select().from(partnerDocuments).orderBy(desc(partnerDocuments.createdAt));
}

export async function createPartnerDocument(data: InsertPartnerDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(partnerDocuments).values(data);
  return result[0].insertId;
}

export async function deletePartnerDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(partnerDocuments).where(eq(partnerDocuments.id, id));
}

// ─── Appointments (Terminbuchungen) ───────────────────────
export async function createAppointment(data: InsertAppointment): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot create appointment: database not available"); return null; }
  try {
    const result = await db.insert(appointments).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create appointment:", error);
    throw error;
  }
}

export async function getAppointmentById(id: number): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get appointment: database not available"); return null; }
  try {
    const result = await db.select().from(appointments).where(eq(appointments.id, id));
    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get appointment:", error);
    return null;
  }
}

export async function getAppointmentsByEmail(email: string): Promise<any[]> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get appointments: database not available"); return []; }
  try {
    const result = await db.select().from(appointments).where(eq(appointments.email, email)).orderBy(desc(appointments.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get appointments:", error);
    return [];
  }
}

export async function updateAppointmentStatus(id: number, status: string, confirmedDate?: Date, confirmedTime?: string): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot update appointment: database not available"); return null; }
  try {
    const updateData: any = { status };
    if (confirmedDate) updateData.confirmedDate = confirmedDate;
    if (confirmedTime) updateData.confirmedTime = confirmedTime;
    
    const result = await db.update(appointments).set(updateData).where(eq(appointments.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update appointment:", error);
    throw error;
  }
}

export async function getAllAppointments(): Promise<any[]> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get appointments: database not available"); return []; }
  try {
    const result = await db.select().from(appointments).orderBy(desc(appointments.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get appointments:", error);
    return [];
  }
}

// ─── Reviews (Bewertungen) ───────────────────────
export async function createReview(data: InsertReview): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot create review: database not available"); return null; }
  try {
    const result = await db.insert(reviews).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create review:", error);
    throw error;
  }
}

export async function getPublishedReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get reviews: database not available"); return []; }
  try {
    const result = await db.select().from(reviews)
      .where(and(eq(reviews.isPublished, true), eq(reviews.isApproved, true)))
      .orderBy(desc(reviews.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get reviews:", error);
    return [];
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get reviews: database not available"); return []; }
  try {
    const result = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get reviews:", error);
    return [];
  }
}

export async function approveReview(id: string): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot approve review: database not available"); return null; }
  try {
    const result = await db.update(reviews).set({ isApproved: true, isPublished: true }).where(eq(reviews.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to approve review:", error);
    throw error;
  }
}

export async function rejectReview(id: string): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot reject review: database not available"); return null; }
  try {
    const result = await db.update(reviews).set({ isApproved: false, isPublished: false }).where(eq(reviews.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to reject review:", error);
    throw error;
  }
}

export async function getReviewStats(): Promise<{ averageRating: number; totalReviews: number; ratingDistribution: Record<number, number> }> {
  const db = await getDb();
  if (!db) { return { averageRating: 0, totalReviews: 0, ratingDistribution: {} }; }
  try {
    const publishedReviews = await getPublishedReviews();
    if (publishedReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
    }
    
    const totalRating = publishedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / publishedReviews.length;
    
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    publishedReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });
    
    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: publishedReviews.length,
      ratingDistribution
    };
  } catch (error) {
    console.error("[Database] Failed to get review stats:", error);
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
  }
}

// ─── Newsletter Subscribers ───────────────────────
export async function subscribeToNewsletter(data: InsertNewsletterSubscriber): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot subscribe to newsletter: database not available"); return null; }
  try {
    // Check if subscriber already exists
    const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, data.email));
    if (existing && existing.length > 0) {
      // Update existing subscriber
      await db.update(newsletterSubscribers)
        .set({ isSubscribed: true, isVerified: false, verificationToken: data.verificationToken, verificationTokenExpiresAt: data.verificationTokenExpiresAt })
        .where(eq(newsletterSubscribers.email, data.email));
      return { id: existing[0].id };
    }
    // Create new subscriber
    const result = await db.insert(newsletterSubscribers).values(data);
    // Get the created subscriber to return ID
    const created = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, data.email));
    return created && created.length > 0 ? { id: created[0].id } : result;
  } catch (error) {
    console.error("[Database] Failed to subscribe to newsletter:", error);
    throw error;
  }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get newsletter subscribers: database not available"); return []; }
  try {
    const result = await db.select().from(newsletterSubscribers)
      .where(and(eq(newsletterSubscribers.isSubscribed, true), eq(newsletterSubscribers.isVerified, true)))
      .orderBy(desc(newsletterSubscribers.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get newsletter subscribers:", error);
    return [];
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<any> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot unsubscribe from newsletter: database not available"); return null; }
  try {
    const result = await db.update(newsletterSubscribers)
      .set({ isSubscribed: false })
      .where(eq(newsletterSubscribers.email, email));
    return result;
  } catch (error) {
    console.error("[Database] Failed to unsubscribe from newsletter:", error);
    throw error;
  }
}

export async function verifyNewsletterSubscriber(email: string): Promise<{ id: string } | null> {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot verify newsletter subscriber: database not available"); return null; }
  try {
    // Fetch subscriber first to check token expiration
    const subscribers = await db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));

    if (!subscribers || subscribers.length === 0) {
      throw new Error("Subscriber not found");
    }

    const subscriber = subscribers[0];

    // Check if verification token has expired
    if (subscriber.verificationTokenExpiresAt && subscriber.verificationTokenExpiresAt < new Date()) {
      throw new Error("Der Verifizierungslink ist abgelaufen. Bitte fordern Sie eine neue Bestätigungs-Email an.");
    }

    // Mark as verified and clear token in one operation
    await db.update(newsletterSubscribers)
      .set({ isVerified: true, verificationToken: null, verificationTokenExpiresAt: null })
      .where(eq(newsletterSubscribers.email, email));

    return { id: subscriber.id };
  } catch (error) {
    console.error("[Database] Failed to verify newsletter subscriber:", error);
    throw error;
  }
}
