import { describe, it, expect, beforeAll } from "vitest";
import { testEmailConnection, sendAppointmentConfirmation } from "./email-service";

describe("Email Service", () => {
  it("should verify email connection", async () => {
    const isConnected = await testEmailConnection();
    expect(isConnected).toBe(true);
  }, { timeout: 10000 });

  it("should send appointment confirmation email", async () => {
    const result = await sendAppointmentConfirmation({
      firstName: "Test",
      lastName: "User",
      email: process.env.ADMIN_EMAIL || "test@example.com",
      phone: "+49 123 456789",
      appointmentType: "initial_consultation",
      preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Tage in der Zukunft
      careNeeds: "Test care needs",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  }, { timeout: 15000 });
});
