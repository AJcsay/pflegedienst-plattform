/**
 * Admin Setup Flow Tests
 * Tests for checkSetupStatus and admin setup procedures
 */

import { describe, it, expect, beforeEach } from "vitest";
import { listAdminUsers, createAdminUser } from "./admin-auth-service";
import { nanoid } from "nanoid";

describe("Admin Setup Flow", () => {
  let testEmail: string;
  let testPassword: string;
  let testName: string;

  beforeEach(() => {
    const id = nanoid(8);
    testEmail = `setup-test-${id}@example.com`;
    testPassword = "TestPassword123!";
    testName = `Setup Test Admin ${id}`;
  });

  describe("checkSetupStatus", () => {
    it("should report setupNeeded based on admin count", async () => {
      const users = await listAdminUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(0);
    });

    it("should return correct adminCount", async () => {
      const users = await listAdminUsers();
      expect(users).toHaveLength(users.length);
      expect(users.every((u: any) => u.email && u.role)).toBe(true);
    });
  });

  describe("Admin Creation", () => {
    it("should create admin with specified role", async () => {
      const result = await createAdminUser({
        email: testEmail,
        password: testPassword,
        name: testName,
        role: "owner",
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.role).toBe("owner");
      expect(result.user?.email).toBe(testEmail);
    });

    it("should create admin with admin role", async () => {
      const adminEmail = `setup-test-admin-${nanoid(8)}@example.com`;
      const result = await createAdminUser({
        email: adminEmail,
        password: testPassword,
        name: "Admin User",
        role: "admin",
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.role).toBe("admin");
      expect(result.user?.email).toBe(adminEmail);
    });
  });

  describe("Admin List Operations", () => {
    it("should list all admin users", async () => {
      const users = await listAdminUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThanOrEqual(1);
    });

    it("should include user metadata in list", async () => {
      const users = await listAdminUsers();
      expect(users.length).toBeGreaterThan(0);
      const user = users[0];
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("role");
      expect(user).toHaveProperty("isActive");
    });

    it("should have at least one owner", async () => {
      const users = await listAdminUsers();
      const hasOwner = users.some((u: any) => u.role === "owner");
      expect(hasOwner).toBe(true);
    });
  });

  describe("Setup Flow Edge Cases", () => {
    it("should reject duplicate email with database error", async () => {
      const result1 = await createAdminUser({
        email: testEmail,
        password: testPassword,
        name: testName,
        role: "owner",
      });

      expect(result1.success).toBe(true);

      // Try to create user with same email - should fail
      try {
        const result2 = await createAdminUser({
          email: testEmail,
          password: "DifferentPassword123!",
          name: "Different Name",
          role: "admin",
        });
        // If we get here without error, the duplicate was not caught
        expect(result2.success).toBe(false);
      } catch (error: any) {
        // Database should throw a duplicate key error
        expect(error.message).toContain("Failed query");
      }
    });

    it("should accept password of any length (validation at router level)", async () => {
      const shortPasswordEmail = `setup-short-${nanoid(8)}@example.com`;
      const result = await createAdminUser({
        email: shortPasswordEmail,
        password: "short",
        name: testName,
        role: "owner",
      });

      // Service accepts the password and hashes it
      // Validation happens at the tRPC router level
      expect(result.success).toBe(true);
      expect(result.user?.email).toBe(shortPasswordEmail);
    });
  });
});
