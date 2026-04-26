/**
 * Admin Authentication Router
 * Uses JWT tokens instead of sessions
 */

import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import { authenticateAdminUser, createAdminUser, listAdminUsers } from "./admin-auth-service";
import { requestPasswordReset, verifyResetToken, completePasswordReset } from "./password-reset-service";
import { generateAdminToken, getAdminUserFromToken } from "./admin-jwt-service";
import { updateAdminUserRole, deactivateAdminUser, reactivateAdminUser, deleteAdminUser, getAdminUserStats } from "./admin-management-service";
import { TRPCError } from "@trpc/server";

export const adminAuthRouter = router({
  /**
   * Check if setup is needed (no admins exist yet)
   */
  checkSetupStatus: publicProcedure
    .query(async () => {
      const users = await listAdminUsers();
      return {
        setupNeeded: users.length === 0,
        adminCount: users.length,
      };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const result = await authenticateAdminUser(input.email, input.password);
      
      if (!result.success) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: result.message,
        });
      }
      
      // Generate JWT token
      const token = await generateAdminToken(result.user!.id);
      
      return {
        success: true,
        user: result.user,
        token,
      };
    }),

  /**
   * Get current admin user from JWT token
   */
  me: publicProcedure
    .input(z.object({ token: z.string() }).optional())
    .query(async ({ input }) => {
      if (!input?.token) {
        return null;
      }
      
      const user = await getAdminUserFromToken(input.token);
      return user || null;
    }),

  /**
   * Request password reset
   */
  requestPasswordReset: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const result = await requestPasswordReset(input.email);
      return result;
    }),

  /**
   * Verify reset token
   */
  verifyResetToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const result = await verifyResetToken(input.token);
      return result;
    }),

  /**
   * Complete password reset
   */
  completePasswordReset: publicProcedure
    .input(z.object({
      token: z.string(),
      newPassword: z.string().min(6),
    }))
    .mutation(async ({ input }) => {
      const result = await completePasswordReset(input.token, input.newPassword);
      
      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }
      
      return result;
    }),

  /**
   * Logout (client-side only - just remove token)
   */
  logout: publicProcedure
    .mutation(async () => {
      // Token removal happens on client side
      return { success: true, message: "Logged out successfully" };
    }),

  /**
   * List all admin users (admin only)
   */
  listUsers: publicProcedure
    .input(z.object({ token: z.string() }).optional())
    .query(async ({ input }) => {
      if (!input?.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can list users",
        });
      }

      return await listAdminUsers();
    }),

  /**
   * Create new admin user (owner only)
   */
  createUser: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6).optional(),
      name: z.string(),
      role: z.enum(["admin", "owner"]).optional(),
      token: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // First user can be created without token
      const users = await listAdminUsers();
      
      if (users.length > 0) {
        // Subsequent users require owner token
        if (!input.token) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        const user = await getAdminUserFromToken(input.token);
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid token",
          });
        }

        if (user.role !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only owners can create users",
          });
        }
      }

      // Generate random password if not provided
      const password = input.password || Math.random().toString(36).slice(-8);

      const result = await createAdminUser({
        email: input.email,
        password,
        name: input.name,
        role: input.role || (users.length === 0 ? "owner" : "admin"),
      });

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }

      return result.user;
    }),

  /**
   * Update admin user role (owner only)
   */
  updateUserRole: publicProcedure
    .input(z.object({
      userId: z.number(),
      newRole: z.enum(["admin", "owner"]),
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can update user roles",
        });
      }

      return await updateAdminUserRole(input.userId, input.newRole);
    }),

  /**
   * Deactivate admin user (owner only)
   */
  deactivateUser: publicProcedure
    .input(z.object({
      userId: z.number(),
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can deactivate users",
        });
      }

      return await deactivateAdminUser(input.userId);
    }),

  /**
   * Reactivate admin user (owner only)
   */
  reactivateUser: publicProcedure
    .input(z.object({
      userId: z.number(),
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can reactivate users",
        });
      }

      return await reactivateAdminUser(input.userId);
    }),

  /**
   * Delete admin user (owner only)
   */
  deleteUser: publicProcedure
    .input(z.object({
      userId: z.number(),
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can delete users",
        });
      }

      return await deleteAdminUser(input.userId);
    }),

  /**
   * Get admin user statistics (owner only)
   */
  getUserStats: publicProcedure
    .input(z.object({ token: z.string() }).optional())
    .query(async ({ input }) => {
      if (!input?.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const user = await getAdminUserFromToken(input.token);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      if (user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can view user statistics",
        });
      }

      return await getAdminUserStats();
    }),
});
