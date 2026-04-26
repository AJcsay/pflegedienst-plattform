/**
 * Admin Authentication Service
 * Handles email/password login for admin users
 */

import bcryptjs from 'bcryptjs';
import { getDb } from './db';
import { adminUsers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Create a new admin user
 */
export async function createAdminUser(data: { email: string; password: string; name: string; role?: 'admin' | 'owner' }) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const passwordHash = await hashPassword(data.password);
  
  try {
    await db.insert(adminUsers).values({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role || 'admin',
      isActive: true,
    });
    
    // Get the created user
    const users = await db.select().from(adminUsers).where(eq(adminUsers.email, data.email)).limit(1);
    const user = users[0];
    
    return {
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Email already exists' };
    }
    throw error;
  }
}

/**
 * Authenticate admin user with email and password
 */
export async function authenticateAdminUser(email: string, password: string) {
  const db = await getDb();
  if (!db) return { success: false, message: 'Database not available' };
  
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  
  if (!user || user.length === 0) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  const adminUser = user[0];
  
  if (!adminUser.isActive) {
    return { success: false, message: 'Account is inactive' };
  }
  
  const passwordValid = await verifyPassword(password, adminUser.passwordHash);
  
  if (!passwordValid) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, adminUser.id));
  
  return {
    success: true,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    },
  };
}

/**
 * Get admin user by ID
 */
export async function getAdminUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);
  
  if (!user || user.length === 0) {
    return null;
  }
  
  const adminUser = user[0];
  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    isActive: adminUser.isActive !== undefined ? adminUser.isActive : true,
  };
}

/**
 * Update admin user password
 */
export async function updateAdminUserPassword(id: number, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const passwordHash = await hashPassword(newPassword);
  
  await db
    .update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.id, id));
  
  return { success: true, message: 'Password updated successfully' };
}

/**
 * List all admin users
 */
export async function listAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  
  const users = await db
    .select()
    .from(adminUsers);
  
  return users.map((u: any) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  }));
}

/**
 * Deactivate admin user
 */
export async function deactivateAdminUser(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(adminUsers)
    .set({ isActive: false })
    .where(eq(adminUsers.id, id));
  
  return { success: true, message: 'Admin user deactivated' };
}
