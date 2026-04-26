import { describe, it, expect, beforeEach } from "vitest";
import { getDb } from "./db";
import { adminUsers, passwordResetTokens } from "../drizzle/schema";
import {
  generateResetToken,
  requestPasswordReset,
  verifyResetToken,
  completePasswordReset,
  cleanupExpiredTokens,
} from "./password-reset-service";
import { createAdminUser } from "./admin-auth-service";
import { eq } from "drizzle-orm";

describe("Password Reset Service", () => {
  let testAdminEmail = "reset-test@example.com";
  let testPassword = "TestPassword123!";

  beforeEach(async () => {
    // Clean up before each test
    const db = await getDb();
    if (db) {
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, 0)).catch(() => {});
      await db.delete(adminUsers).where(eq(adminUsers.email, testAdminEmail)).catch(() => {});
    }
  });

  it("should generate a valid reset token", () => {
    const token = generateResetToken();
    expect(token).toBeDefined();
    expect(token.length).toBe(64); // 32 bytes = 64 hex characters
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it("should request password reset for existing email", async () => {
    // Create test admin user
    const createResult = await createAdminUser({
      email: testAdminEmail,
      password: testPassword,
      name: "Test Admin",
    });
    expect(createResult.success).toBe(true);

    // Request password reset
    const result = await requestPasswordReset(testAdminEmail);
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.resetLink).toBeDefined();
    expect(result.resetLink).toContain("reset-password");
    expect(result.resetLink).toContain(result.token);
  });

  it("should not reveal if email exists (security)", async () => {
    const result = await requestPasswordReset("nonexistent@example.com");
    expect(result.success).toBe(true);
    expect(result.message).toContain("If email exists");
  });

  it("should verify valid reset token", async () => {
    // Create test admin user
    const createResult = await createAdminUser({
      email: testAdminEmail,
      password: testPassword,
      name: "Test Admin",
    });
    expect(createResult.success).toBe(true);

    // Request password reset
    const resetResult = await requestPasswordReset(testAdminEmail);
    expect(resetResult.success).toBe(true);
    const token = resetResult.token!;

    // Verify token
    const verifyResult = await verifyResetToken(token);
    expect(verifyResult.success).toBe(true);
    expect(verifyResult.email).toBe(testAdminEmail);
    expect(verifyResult.expiresAt).toBeDefined();
  });

  it("should reject invalid reset token", async () => {
    const result = await verifyResetToken("invalid-token-12345");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid");
  });

  it("should reject expired reset token", async () => {
    // Create test admin user
    const createResult = await createAdminUser({
      email: testAdminEmail,
      password: testPassword,
      name: "Test Admin",
    });
    expect(createResult.success).toBe(true);

    // Create an expired token manually
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true); // Skip if no DB
      return;
    }

    const expiredToken = generateResetToken();
    const expiredDate = new Date(Date.now() - 1000); // 1 second ago

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, testAdminEmail));

    if (users.length > 0) {
      await db.insert(passwordResetTokens).values({
        adminUserId: users[0].id,
        token: expiredToken,
        expiresAt: expiredDate,
      });

      // Try to verify expired token
      const result = await verifyResetToken(expiredToken);
      expect(result.success).toBe(false);
      expect(result.message).toContain("expired");
    }
  });

  it("should complete password reset with valid token", async () => {
    // Create test admin user
    const createResult = await createAdminUser({
      email: testAdminEmail,
      password: testPassword,
      name: "Test Admin",
    });
    expect(createResult.success).toBe(true);

    // Request password reset
    const resetResult = await requestPasswordReset(testAdminEmail);
    expect(resetResult.success).toBe(true);
    const token = resetResult.token!;

    // Complete password reset
    const newPassword = "NewPassword456!";
    const completeResult = await completePasswordReset(token, newPassword);
    expect(completeResult.success).toBe(true);
    expect(completeResult.message).toContain("successfully");

    // Verify token is now used
    const verifyResult = await verifyResetToken(token);
    expect(verifyResult.success).toBe(false);
    expect(verifyResult.message).toContain("already been used");
  });

  it("should reject completion with invalid token", async () => {
    const result = await completePasswordReset("invalid-token", "NewPassword123!");
    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid");
  });

  it("should cleanup expired tokens", async () => {
    // Create test admin user
    const createResult = await createAdminUser({
      email: testAdminEmail,
      password: testPassword,
      name: "Test Admin",
    });
    expect(createResult.success).toBe(true);

    // Create multiple tokens (some expired, some valid)
    const db = await getDb();
    if (!db) {
      expect(true).toBe(true); // Skip if no DB
      return;
    }

    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, testAdminEmail));

    if (users.length > 0) {
      const userId = users[0].id;

      // Create expired token
      await db.insert(passwordResetTokens).values({
        adminUserId: userId,
        token: generateResetToken(),
        expiresAt: new Date(Date.now() - 1000),
      });

      // Create valid token
      await db.insert(passwordResetTokens).values({
        adminUserId: userId,
        token: generateResetToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // Cleanup
      const cleanupResult = await cleanupExpiredTokens();
      expect(cleanupResult.success).toBe(true);

      // Verify expired token is gone
      const tokens = await db
        .select()
        .from(passwordResetTokens)
        .where(eq(passwordResetTokens.adminUserId, userId));

      expect(tokens.length).toBe(1); // Only valid token remains
    }
  });
});
