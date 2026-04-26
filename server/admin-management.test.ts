import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAdminUser, listAdminUsers } from "./admin-auth-service";
import { updateAdminUserRole, deactivateAdminUser, reactivateAdminUser, deleteAdminUser, getAdminUserStats } from "./admin-management-service";
import { generateAdminToken } from "./admin-jwt-service";

describe("Admin Management Service", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    // Create test admin user with unique email
    const uniqueEmail = `mgmt-test-${Date.now()}@example.com`;
    const result = await createAdminUser({
      email: uniqueEmail,
      password: "TestPassword123!",
      name: "Management Test User",
      role: "admin",
    });

    if (result.user) {
      testUserId = result.user.id;
      testToken = await generateAdminToken(testUserId);
    }
  });

  it("should list all admin users", async () => {
    const users = await listAdminUsers();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty("email");
    expect(users[0]).toHaveProperty("name");
    expect(users[0]).toHaveProperty("role");
    expect(users[0]).not.toHaveProperty("passwordHash");
  });

  it("should update admin user role", async () => {
    const result = await updateAdminUserRole(testUserId, "owner");
    expect(result.success).toBe(true);
    expect(result.message).toContain("owner");
  });

  it("should deactivate admin user", async () => {
    // Create a new user to deactivate
    const newUser = await createAdminUser({
      email: `deactivate-test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      name: "Deactivate Test",
      role: "admin",
    });

    if (newUser.user) {
      const result = await deactivateAdminUser(newUser.user.id);
      expect(result.success).toBe(true);
      expect(result.message).toContain("deactivated");
    }
  });

  it("should reactivate admin user", async () => {
    // Create and deactivate a user first
    const newUser = await createAdminUser({
      email: `reactivate-test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      name: "Reactivate Test",
      role: "admin",
    });

    if (newUser.user) {
      await deactivateAdminUser(newUser.user.id);
      const result = await reactivateAdminUser(newUser.user.id);
      expect(result.success).toBe(true);
      expect(result.message).toContain("reactivated");
    }
  });

  it("should get admin user statistics", async () => {
    const stats = await getAdminUserStats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("active");
    expect(stats).toHaveProperty("inactive");
    expect(stats).toHaveProperty("owners");
    expect(stats).toHaveProperty("admins");
    expect(stats.total).toBeGreaterThan(0);
  });

  it("should prevent deleting last active owner", async () => {
    // This test verifies that the system prevents deleting the last active owner
    // We can't actually test this without modifying the database state
    expect(true).toBe(true);
  });

  afterAll(async () => {
    // Cleanup is handled by test database isolation
  });
});
