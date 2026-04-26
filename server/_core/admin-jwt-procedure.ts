/**
 * Admin JWT Procedure
 * Validates JWT token from Authorization header or input
 * Used for admin endpoints that accept JWT tokens
 */

import { publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getAdminUserFromToken } from "../admin-jwt-service";
import { z } from "zod";

export const adminJwtProcedure = publicProcedure
  .input(z.object({ token: z.string() }).optional())
  .use(async ({ input, ctx, next }) => {
    let token = input?.token;

    // Try to get token from Authorization header
    if (!token && ctx.req?.headers?.authorization) {
      const authHeader = ctx.req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    // Validate token and get admin user
    const adminUser = await getAdminUserFromToken(token);
    if (!adminUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }

    // Inject admin user into context
    return next({
      ctx: {
        ...ctx,
        adminUser,
        isAdminJwt: true,
      },
    });
  });
