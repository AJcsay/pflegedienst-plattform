/**
 * Admin JWT Authentication Service
 * Uses JWT tokens instead of sessions for better cross-origin support
 */

import jwt from "jsonwebtoken";
import { getDb } from "./db";
import { adminUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface AdminJWTPayload {
  id: number;
  email: string;
  role: "admin" | "owner";
}

export async function generateAdminToken(userId: string | number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, typeof userId === "string" ? parseInt(userId) : userId)).limit(1);
  
  if (!user.length) {
    throw new Error("User not found");
  }

  const payload: AdminJWTPayload = {
    id: user[0].id,
    email: user[0].email,
    role: user[0].role as "admin" | "owner",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev-secret-key", {
    expiresIn: "24h",
  });

  return token;
}

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key") as AdminJWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAdminUserFromToken(token: string) {
  const payload = await verifyAdminToken(token);
  if (!payload) return null;

  const db = await getDb();
  if (!db) return null;
  
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, payload.id)).limit(1);
  
  return user.length ? user[0] : null;
}
