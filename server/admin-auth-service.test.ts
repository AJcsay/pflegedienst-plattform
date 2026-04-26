import { describe, it, expect, beforeEach } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createAdminUser,
  authenticateAdminUser,
  getAdminUserById,
  updateAdminUserPassword,
  listAdminUsers,
} from "./admin-auth-service";
import { nanoid } from "nanoid";

describe("Admin Auth Service", () => {
  let testEmail: string;
  let testPassword: string;
  let testName: string;

  beforeEach(() => {
    // Generate unique test data for each test
    const id = nanoid(8);
    testEmail = `test-${id}@example.com`;
    testPassword = "TestPassword123!";
    testName = `Test Admin ${id}`;
  });

  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const hash = await hashPassword(testPassword);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(20);
    });

    it("should verify a correct password", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword(testPassword, hash);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const hash = await hashPassword(testPassword);
      const isValid = await verifyPassword("WrongPassword123!", hash);
      expect(isValid).toBe(false);
    });

    it("should generate different hashes for the same password", async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Create Admin User", () => {
    it("should create a new admin user", async () => {
      const result = await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });
      expect(result.success).toBe(true);
      expect(result.message).toContain("successfully");
    });

    it("should create an owner user", async () => {
      const result = await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "owner" });
      expect(result.success).toBe(true);
    });
  });

  describe("Authenticate Admin User", () => {
    it("should authenticate with correct credentials", async () => {
      // Create user first
      await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });

      // Then authenticate
      const result = await authenticateAdminUser(testEmail, testPassword);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(testEmail);
    });

    it("should reject invalid email", async () => {
      const result = await authenticateAdminUser("nonexistent@example.com", testPassword);
      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid");
    });

    it("should reject invalid password", async () => {
      // Create user first
      await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });

      // Try with wrong password
      const result = await authenticateAdminUser(testEmail, "WrongPassword123!");
      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid");
    });
  });

  describe("Get Admin User", () => {
    it("should get admin user by ID", async () => {
      // Create user first
      const createResult = await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });
      expect(createResult.success).toBe(true);

      // Authenticate to get user ID
      const authResult = await authenticateAdminUser(testEmail, testPassword);
      expect(authResult.success).toBe(true);
      const userId = authResult.user?.id;

      // Get user by ID
      if (userId) {
        const user = await getAdminUserById(userId);
        expect(user).toBeDefined();
        expect(user?.email).toBe(testEmail);
        expect(user?.role).toBe("admin");
      }
    });

    it("should return null for non-existent user", async () => {
      const user = await getAdminUserById(99999);
      expect(user).toBeNull();
    });
  });

  describe("Update Admin User Password", () => {
    it("should update password", async () => {
      // Create user first
      await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });

      // Authenticate to get user ID
      const authResult = await authenticateAdminUser(testEmail, testPassword);
      expect(authResult.success).toBe(true);
      const userId = authResult.user?.id;

      if (userId) {
        const newPassword = "NewPassword456!";
        const result = await updateAdminUserPassword(userId, newPassword);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("List Admin Users", () => {
    it("should list all admin users", async () => {
      // Create user first
      await createAdminUser({ email: testEmail, password: testPassword, name: testName, role: "admin" });

      // List users
      const users = await listAdminUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);

      const testUser = users.find(u => u.email === testEmail);
      expect(testUser).toBeDefined();
      expect(testUser?.role).toBe("admin");
    });
  });
});
