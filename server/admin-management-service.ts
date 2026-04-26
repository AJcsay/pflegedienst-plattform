/**
 * Admin User Management Service
 * Handles admin user CRUD operations, role management, and deactivation
 */

import { getDb } from "./db";
import { adminUsers } from "../drizzle/schema";
import { eq, ne, and } from "drizzle-orm";

/**
 * Get all admin users
 */
export async function listAdminUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const users = await db.select().from(adminUsers).orderBy(adminUsers.createdAt);
  
  // Remove password hashes from response
  return users.map(user => ({
    ...user,
    passwordHash: undefined,
  }));
}

/**
 * Get admin user by ID
 */
export async function getAdminUserById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  
  if (!user[0]) {
    throw new Error("Admin user not found");
  }
  
  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user[0];
  return userWithoutPassword;
}

/**
 * Get admin user by email
 */
export async function getAdminUserByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  return user[0] || null;
}

/**
 * Update admin user role
 */
export async function updateAdminUserRole(id: number, newRole: "admin" | "owner") {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  // Verify user exists
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!user[0]) {
    throw new Error("Admin user not found");
  }
  
  // Update role
  await db.update(adminUsers).set({ role: newRole }).where(eq(adminUsers.id, id));
  
  return { success: true, message: `User role updated to ${newRole}` };
}

/**
 * Deactivate admin user
 */
export async function deactivateAdminUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  // Verify user exists
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!user[0]) {
    throw new Error("Admin user not found");
  }
  
  // Prevent deactivating the last active owner
  const activeOwners = await db
    .select()
    .from(adminUsers)
    .where(
      and(
        eq(adminUsers.role, "owner"),
        eq(adminUsers.isActive, true),
        ne(adminUsers.id, id)
      )
    );
  
  if (user[0].role === "owner" && activeOwners.length === 0) {
    throw new Error("Cannot deactivate the last active owner");
  }
  
  // Deactivate user
  await db.update(adminUsers).set({ isActive: false }).where(eq(adminUsers.id, id));
  
  return { success: true, message: "User deactivated" };
}

/**
 * Reactivate admin user
 */
export async function reactivateAdminUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  // Verify user exists
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!user[0]) {
    throw new Error("Admin user not found");
  }
  
  // Reactivate user
  await db.update(adminUsers).set({ isActive: true }).where(eq(adminUsers.id, id));
  
  return { success: true, message: "User reactivated" };
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  // Verify user exists
  const user = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  if (!user[0]) {
    throw new Error("Admin user not found");
  }
  
  // Prevent deleting the last active owner
  const activeOwners = await db
    .select()
    .from(adminUsers)
    .where(
      and(
        eq(adminUsers.role, "owner"),
        eq(adminUsers.isActive, true),
        ne(adminUsers.id, id)
      )
    );
  
  if (user[0].role === "owner" && activeOwners.length === 0) {
    throw new Error("Cannot delete the last active owner");
  }
  
  // Delete user
  await db.delete(adminUsers).where(eq(adminUsers.id, id));
  
  return { success: true, message: "User deleted" };
}

/**
 * Get admin user statistics
 */
export async function getAdminUserStats() {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  const allUsers = await db.select().from(adminUsers);
  const activeUsers = await db.select().from(adminUsers).where(eq(adminUsers.isActive, true));
  const owners = await db.select().from(adminUsers).where(eq(adminUsers.role, "owner"));
  const admins = await db.select().from(adminUsers).where(eq(adminUsers.role, "admin"));
  
  return {
    total: allUsers.length,
    active: activeUsers.length,
    inactive: allUsers.length - activeUsers.length,
    owners: owners.length,
    admins: admins.length,
  };
}
