import { getDb } from "./db";
import { appointmentFeedback, appointments } from "../drizzle/schema";
import { eq, and, isNull } from "drizzle-orm";
import crypto from "crypto";

/**
 * Generate a unique survey token for feedback collection
 */
function generateSurveyToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create a feedback survey for an appointment
 * Called after appointment is completed
 */
export async function createFeedbackSurvey(appointmentId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check if survey already exists
    const existing = await db
      .select()
      .from(appointmentFeedback)
      .where(eq(appointmentFeedback.appointmentId, appointmentId)) as any[];

    if (existing.length > 0) {
      console.log(`[Feedback Survey] Survey already exists for appointment ${appointmentId}`);
      return existing[0];
    }

    // Get appointment details
    const appointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .then((results: any[]) => results[0]);

    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    // Create survey
    const surveyToken = generateSurveyToken();
    const result = await db.insert(appointmentFeedback).values({
      appointmentId,
      surveyToken,
      status: "pending",
    } as any);

    console.log(`[Feedback Survey] Created survey for appointment ${appointmentId}`);
    return { appointmentId, surveyToken, status: "pending" };
  } catch (error) {
    console.error("[Feedback Survey] Error creating survey:", error);
    throw error;
  }
}

/**
 * Get a feedback survey by token
 */
export async function getFeedbackSurveyByToken(surveyToken: string) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const survey = await db
      .select()
      .from(appointmentFeedback)
      .where(eq(appointmentFeedback.surveyToken, surveyToken))
      .then((results: any[]) => results[0]);

    if (!survey) {
      throw new Error("Survey not found");
    }

    // Mark as viewed
    await db
      .update(appointmentFeedback)
      .set({ status: "viewed" })
      .where(eq(appointmentFeedback.surveyToken, surveyToken));

    return survey;
  } catch (error) {
    console.error("[Feedback Survey] Error getting survey:", error);
    throw error;
  }
}

/**
 * Submit feedback for a survey
 */
export async function submitFeedback(
  surveyToken: string,
  feedback: {
    rating: number;
    comments?: string;
    careQuality?: number;
    professionalism?: number;
    communication?: number;
    wouldRecommend?: boolean;
    improvementSuggestions?: string;
  }
) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Validate rating
    if (feedback.rating < 1 || feedback.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Update survey with feedback
    await db
      .update(appointmentFeedback)
      .set({
        rating: feedback.rating,
        comments: feedback.comments || null,
        careQuality: feedback.careQuality || null,
        professionalism: feedback.professionalism || null,
        communication: feedback.communication || null,
        wouldRecommend: feedback.wouldRecommend || null,
        improvementSuggestions: feedback.improvementSuggestions || null,
        submittedAt: new Date(),
        status: "submitted",
      } as any)
      .where(eq(appointmentFeedback.surveyToken, surveyToken));

    console.log(`[Feedback Survey] Feedback submitted for survey ${surveyToken}`);
    return { success: true };
  } catch (error) {
    console.error("[Feedback Survey] Error submitting feedback:", error);
    throw error;
  }
}

/**
 * Get feedback statistics
 */
export async function getFeedbackStats() {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allFeedback = await db.select().from(appointmentFeedback);

    const submitted = allFeedback.filter((f: any) => f.status === "submitted") as any[];
    const averageRating =
      submitted.length > 0
        ? submitted.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / submitted.length
        : 0;

    const wouldRecommendCount = submitted.filter((f: any) => f.wouldRecommend === true).length;
    const recommendationRate =
      submitted.length > 0 ? (wouldRecommendCount / submitted.length) * 100 : 0;

    const stats = {
      total: allFeedback.length,
      pending: allFeedback.filter((f: any) => f.status === "pending").length,
      viewed: allFeedback.filter((f: any) => f.status === "viewed").length,
      submitted: submitted.length,
      averageRating: parseFloat(averageRating.toFixed(2)),
      recommendationRate: parseFloat(recommendationRate.toFixed(2)),
      totalResponses: submitted.length,
    };

    return stats;
  } catch (error) {
    console.error("[Feedback Survey] Error getting stats:", error);
    throw error;
  }
}

/**
 * Get feedback for an appointment
 */
export async function getAppointmentFeedback(appointmentId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const feedback = await db
      .select()
      .from(appointmentFeedback)
      .where(eq(appointmentFeedback.appointmentId, appointmentId))
      .then((results: any[]) => results[0]);

    return feedback || null;
  } catch (error) {
    console.error("[Feedback Survey] Error getting feedback:", error);
    throw error;
  }
}

/**
 * Get all feedback surveys with optional filtering
 */
export async function getAllFeedback(options?: { status?: string; limit?: number; offset?: number }) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    let query = db.select().from(appointmentFeedback);

    // TODO: Add filtering based on options
    const results = await query;

    return results;
  } catch (error) {
    console.error("[Feedback Survey] Error getting all feedback:", error);
    throw error;
  }
}

/**
 * Calculate average rating for a specific criteria
 */
export async function getAverageCriteriaRating(criteria: "careQuality" | "professionalism" | "communication") {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allFeedback = await db.select().from(appointmentFeedback);
    const submitted = allFeedback.filter((f: any) => f.status === "submitted") as any[];

    if (submitted.length === 0) return 0;

    const sum = submitted.reduce((acc: number, f: any) => {
      const value = f[criteria];
      return acc + (value ? value : 0);
    }, 0);

    return parseFloat((sum / submitted.length).toFixed(2));
  } catch (error) {
    console.error("[Feedback Survey] Error calculating average rating:", error);
    throw error;
  }
}
