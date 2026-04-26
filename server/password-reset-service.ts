/**
 * Password Reset Service
 * Handles secure password reset token generation, validation, and completion
 */

import { randomBytes } from "crypto";
import { getDb } from "./db";
import { passwordResetTokens, adminUsers } from "../drizzle/schema";
import { eq, lt } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./admin-auth-service";
import { sendPasswordResetEmail } from "./email-service";

/**
 * Generate a secure reset token (32 bytes = 256 bits)
 */
export function generateResetToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Request password reset by creating a reset token
 * Returns token for email sending (in production, email would be sent by email service)
 */
export async function requestPasswordReset(email: string) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    // Find admin user by email
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!users || users.length === 0) {
      // Don't reveal if email exists for security
      return { success: true, message: "If email exists, reset link has been sent" };
    }

    const user = users[0];

    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token in database
    await db.insert(passwordResetTokens).values({
      adminUserId: user.id,
      token,
      expiresAt,
    });

    // Generate reset link
    const resetLink = `${process.env.VITE_FRONTEND_URL || "http://localhost:5173"}/admin/reset-password?token=${token}`;

    // Send email with reset link
    const emailResult = await sendPasswordResetEmail(email, resetLink);

    // Log email result for debugging
    if (!emailResult.success) {
      console.warn(`Password reset email failed for ${email}:`, emailResult.error);
    }

    // Return response (only include token/link for testing/development)
    const isProduction = process.env.NODE_ENV === "production";
    const response: any = {
      success: true,
      message: "If an account exists with this email, a password reset link has been sent",
      emailSent: emailResult.success,
    };

    // Only include token/resetLink in development/testing
    if (!isProduction) {
      response.token = token;
      response.resetLink = resetLink;
    }

    return response;
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Verify reset token validity
 */
export async function verifyResetToken(token: string) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    // Find reset token
    const tokens = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!tokens || tokens.length === 0) {
      return { success: false, message: "Invalid reset token" };
    }

    const resetToken = tokens[0];

    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      return { success: false, message: "Reset token has expired" };
    }

    // Check if token has already been used
    if (resetToken.usedAt) {
      return { success: false, message: "Reset token has already been used" };
    }

    // Get admin user info (without password hash)
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, resetToken.adminUserId))
      .limit(1);

    if (!users || users.length === 0) {
      return { success: false, message: "User not found" };
    }

    const user = users[0];

    return {
      success: true,
      message: "Token is valid",
      email: user.email,
      expiresAt: resetToken.expiresAt,
    };
  } catch (error: any) {
    console.error("Error verifying reset token:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Complete password reset with new password
 */
export async function completePasswordReset(token: string, newPassword: string) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    // Verify token first
    const tokenVerification = await verifyResetToken(token);
    if (!tokenVerification.success) {
      return tokenVerification;
    }

    // Find reset token
    const tokens = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (!tokens || tokens.length === 0) {
      return { success: false, message: "Invalid reset token" };
    }

    const resetToken = tokens[0];

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update admin user password
    await db
      .update(adminUsers)
      .set({ passwordHash })
      .where(eq(adminUsers.id, resetToken.adminUserId));

    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetToken.id));

    return { success: true, message: "Password reset successfully" };
  } catch (error: any) {
    console.error("Error completing password reset:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Clean up expired reset tokens (should be run periodically)
 */
export async function cleanupExpiredTokens() {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    await db
      .delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, new Date()));

    return { success: true, message: "Cleaned up expired tokens" };
  } catch (error: any) {
    console.error("Error cleaning up expired tokens:", error);
    return { success: false, message: error.message };
  }
}
