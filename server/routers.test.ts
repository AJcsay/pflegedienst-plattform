import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as any,
  };
}

function createAdminContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const user: AuthenticatedUser = {
    id: 1, openId: "admin-user", email: "admin@pflegeherz.de",
    name: "Admin", loginMethod: "manus", role: "admin",
    createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
  };
  return {
    ctx: {
      user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string, options: any) => { clearedCookies.push({ name, options }); } } as any,
    },
    clearedCookies,
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2, openId: "regular-user", email: "user@test.de",
    name: "Regular User", loginMethod: "manus", role: "user",
    createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as any,
  };
}

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("admin@pflegeherz.de");
    expect(result?.role).toBe("admin");
  });
});

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("admin procedures access control", () => {
  it("rejects non-admin users from listing all jobs", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.jobs.listAll()).rejects.toThrow();
  });

  it("rejects non-admin users from listing applications", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.applications.list()).rejects.toThrow();
  });

  it("rejects non-admin users from listing referrals", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.referrals.list()).rejects.toThrow();
  });

  it("rejects non-admin users from listing capacity inquiries", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.capacity.list()).rejects.toThrow();
  });

  it("rejects non-admin users from listing contacts", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.contact.list()).rejects.toThrow();
  });

  it("rejects unauthenticated users from admin procedures", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.jobs.listAll()).rejects.toThrow();
    await expect(caller.applications.list()).rejects.toThrow();
  });
});

describe("public procedures", () => {
  it("allows public access to job listings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Should not throw (returns empty array if DB unavailable)
    const result = await caller.jobs.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("allows public access to document listings", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.documents.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
