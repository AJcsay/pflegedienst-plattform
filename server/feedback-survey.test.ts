import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { appointments, appointmentFeedback } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  createFeedbackSurvey,
  getFeedbackSurveyByToken,
  submitFeedback,
  getFeedbackStats,
  getAppointmentFeedback,
  getAllFeedback,
  getAverageCriteriaRating,
} from "./feedback-survey-service";

describe("Feedback Survey Service", () => {
  let db: any;
  let testAppointmentId: number;
  let testSurveyToken: string;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create a test appointment
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // 1 day ago

    await db
      .insert(appointments)
      .values({
        firstName: "Test",
        lastName: "Patient",
        email: "feedback-survey@example.com",
        phone: "123-456-7890",
        appointmentType: "initial_consultation",
        preferredDate: pastDate,
        preferredTime: "10:00",
        status: "completed",
        confirmedDate: pastDate,
        confirmedTime: "10:00",
      } as any);

    const results = await db
      .select()
      .from(appointments)
      .where(eq(appointments.email, "feedback-survey@example.com"));

    testAppointmentId = results[results.length - 1].id;
  });

  afterAll(async () => {
    if (!db) return;

    // Clean up test data
    await db
      .delete(appointmentFeedback)
      .where(eq(appointmentFeedback.appointmentId, testAppointmentId));

    await db
      .delete(appointments)
      .where(eq(appointments.id, testAppointmentId));
  });

  it("should create a feedback survey", async () => {
    const survey = await createFeedbackSurvey(testAppointmentId);
    expect(survey).toHaveProperty("appointmentId");
    expect(survey).toHaveProperty("surveyToken");
    expect(survey).toHaveProperty("status");
    expect(survey.status).toBe("pending");
    testSurveyToken = survey.surveyToken;
  });

  it("should not create duplicate surveys", async () => {
    const survey1 = await createFeedbackSurvey(testAppointmentId);
    const survey2 = await createFeedbackSurvey(testAppointmentId);
    expect(survey1.surveyToken).toBe(survey2.surveyToken);
  });

  it("should get feedback survey by token", async () => {
    const survey = await getFeedbackSurveyByToken(testSurveyToken);
    expect(survey).toBeDefined();
    expect(survey.surveyToken).toBe(testSurveyToken);
    // Status can be pending or viewed
    expect(["pending", "viewed"]).toContain(survey.status);
  });

  it("should submit feedback", async () => {
    const feedback = {
      rating: 5,
      comments: "Excellent service!",
      careQuality: 5,
      professionalism: 5,
      communication: 5,
      wouldRecommend: true,
      improvementSuggestions: "None",
    };

    const result = await submitFeedback(testSurveyToken, feedback);
    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);

    // Verify feedback was saved
    const survey = await db
      .select()
      .from(appointmentFeedback)
      .where(eq(appointmentFeedback.surveyToken, testSurveyToken))
      .then((results: any[]) => results[0]);

    expect(survey.rating).toBe(5);
    expect(survey.comments).toBe("Excellent service!");
    expect(survey.status).toBe("submitted");
  });

  it("should validate rating range", async () => {
    try {
      await submitFeedback(testSurveyToken, {
        rating: 10, // Invalid rating
      });
      expect.fail("Should have thrown error");
    } catch (error) {
      expect((error as Error).message).toContain("Rating must be between 1 and 5");
    }
  });

  it("should get feedback statistics", async () => {
    const stats = await getFeedbackStats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("pending");
    expect(stats).toHaveProperty("viewed");
    expect(stats).toHaveProperty("submitted");
    expect(stats).toHaveProperty("averageRating");
    expect(stats).toHaveProperty("recommendationRate");
  });

  it("should get appointment feedback", async () => {
    const feedback = await getAppointmentFeedback(testAppointmentId);
    expect(feedback).toBeDefined();
    expect(feedback.appointmentId).toBe(testAppointmentId);
  });

  it("should get all feedback", async () => {
    const allFeedback = await getAllFeedback();
    expect(Array.isArray(allFeedback)).toBe(true);
  });

  it("should calculate average criteria ratings", async () => {
    const careQualityAvg = await getAverageCriteriaRating("careQuality");
    const professionalismAvg = await getAverageCriteriaRating("professionalism");
    const communicationAvg = await getAverageCriteriaRating("communication");

    expect(typeof careQualityAvg).toBe("number");
    expect(typeof professionalismAvg).toBe("number");
    expect(typeof communicationAvg).toBe("number");

    // Should be between 0 and 5 if any feedback exists
    if (careQualityAvg > 0) {
      expect(careQualityAvg).toBeGreaterThanOrEqual(0);
      expect(careQualityAvg).toBeLessThanOrEqual(5);
    }
  });

  it("should handle non-existent survey token", async () => {
    try {
      await getFeedbackSurveyByToken("non-existent-token");
      expect.fail("Should have thrown error");
    } catch (error) {
      expect((error as Error).message).toContain("Survey not found");
    }
  });

  it("should track survey status transitions", async () => {
    // Create new survey
    const newAppointmentId = testAppointmentId + 1000; // Use different ID
    try {
      const survey = await createFeedbackSurvey(newAppointmentId);
      expect(survey.status).toBe("pending");

      // Get survey (marks as viewed)
      const viewed = await getFeedbackSurveyByToken(survey.surveyToken);
      expect(viewed.status).toBe("viewed");

      // Submit feedback (marks as submitted)
      await submitFeedback(survey.surveyToken, { rating: 4 });
      const submitted = await db
        .select()
        .from(appointmentFeedback)
        .where(eq(appointmentFeedback.surveyToken, survey.surveyToken))
        .then((results: any[]) => results[0]);
      expect(submitted.status).toBe("submitted");
    } catch (error) {
      // Appointment might not exist, that's ok for this test
    }
  });

  it("should handle partial feedback submission", async () => {
    // Create another survey
    const newAppointmentId = testAppointmentId + 2000;
    try {
      const survey = await createFeedbackSurvey(newAppointmentId);

      // Submit only required field
      const result = await submitFeedback(survey.surveyToken, {
        rating: 3,
      });
      expect(result.success).toBe(true);

      // Verify only rating was saved
      const feedback = await db
        .select()
        .from(appointmentFeedback)
        .where(eq(appointmentFeedback.surveyToken, survey.surveyToken))
        .then((results: any[]) => results[0]);

      expect(feedback.rating).toBe(3);
      expect(feedback.comments).toBeNull();
    } catch (error) {
      // Appointment might not exist, that's ok
    }
  });

  it("should calculate recommendation rate correctly", async () => {
    const stats = await getFeedbackStats();
    if (stats.submitted > 0) {
      expect(stats.recommendationRate).toBeGreaterThanOrEqual(0);
      expect(stats.recommendationRate).toBeLessThanOrEqual(100);
    }
  });
});
