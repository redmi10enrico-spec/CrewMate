import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  createMcVerificationCode,
  generateVerificationCode,
  getProfile,
  hasRoleAtLeast,
  updateMcUsername,
  verifyMcCode,
} from "./profiles";

function mockVerifyClient(options: {
  codeRow: { id: string; user_id: string; expires_at: string; used: boolean } | null;
  lookupError?: { message: string } | null;
  markUsedError?: { message: string } | null;
  profileError?: { message: string } | null;
}) {
  const maybeSingle = vi
    .fn()
    .mockResolvedValue({ data: options.codeRow, error: options.lookupError ?? null });
  const selectEq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq: selectEq });

  const updateCodesEq = vi.fn().mockResolvedValue({ error: options.markUsedError ?? null });
  const updateCodes = vi.fn().mockReturnValue({ eq: updateCodesEq });

  const updateProfileEq = vi.fn().mockResolvedValue({ error: options.profileError ?? null });
  const updateProfile = vi.fn().mockReturnValue({ eq: updateProfileEq });

  const from = vi.fn((table: string) => {
    if (table === "mc_verification_codes") {
      return { select, update: updateCodes };
    }
    if (table === "profiles") {
      return { update: updateProfile };
    }
    throw new Error(`unexpected table ${table}`);
  });

  return {
    client: { from } as unknown as SupabaseClient<Database>,
    updateCodes,
    updateProfile,
  };
}

describe("hasRoleAtLeast", () => {
  it("returns true when the role meets the minimum", () => {
    expect(hasRoleAtLeast("admin", "mod")).toBe(true);
    expect(hasRoleAtLeast("mod", "mod")).toBe(true);
  });

  it("returns false when the role is below the minimum", () => {
    expect(hasRoleAtLeast("user", "helper")).toBe(false);
    expect(hasRoleAtLeast("helper", "admin")).toBe(false);
  });
});

describe("generateVerificationCode", () => {
  it("generates a 6-character code from the unambiguous alphabet", () => {
    const code = generateVerificationCode();
    expect(code).toHaveLength(6);
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
  });
});

describe("getProfile", () => {
  it("returns the profile row on success", async () => {
    const mockRow = { id: "user-1", username: null, role: "user" };
    const maybeSingle = vi.fn().mockResolvedValue({ data: mockRow, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getProfile(client, "user-1");

    expect(from).toHaveBeenCalledWith("profiles");
    expect(select).toHaveBeenCalledWith("*");
    expect(eq).toHaveBeenCalledWith("id", "user-1");
    expect(result).toEqual(mockRow);
  });

  it("throws when Supabase returns an error", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getProfile(client, "user-1")).rejects.toThrow("getProfile: boom");
  });
});

describe("updateMcUsername", () => {
  it("updates the mc_username of the given user", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await updateMcUsername(client, "user-1", "Steve");

    expect(from).toHaveBeenCalledWith("profiles");
    expect(update).toHaveBeenCalledWith({ mc_username: "Steve" });
    expect(eq).toHaveBeenCalledWith("id", "user-1");
  });

  it("throws when Supabase returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(updateMcUsername(client, "user-1", "Steve")).rejects.toThrow(
      "updateMcUsername: boom"
    );
  });
});

describe("createMcVerificationCode", () => {
  it("inserts a code with a future expiry and returns it", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const before = Date.now();
    const result = await createMcVerificationCode(client, "user-1");
    const after = Date.now();

    expect(from).toHaveBeenCalledWith("mc_verification_codes");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: "user-1", code: result.code })
    );
    expect(result.code).toHaveLength(6);
    expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(before);
    expect(new Date(result.expiresAt).getTime()).toBeGreaterThan(after);
  });

  it("throws when Supabase returns an error", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(createMcVerificationCode(client, "user-1")).rejects.toThrow(
      "createMcVerificationCode: boom"
    );
  });
});

describe("verifyMcCode", () => {
  it("returns invalid when the code does not exist", async () => {
    const { client } = mockVerifyClient({ codeRow: null });

    const result = await verifyMcCode(client, "AAAAAA");

    expect(result).toEqual({ status: "invalid" });
  });

  it("returns already_used when the code was consumed before", async () => {
    const { client } = mockVerifyClient({
      codeRow: {
        id: "code-1",
        user_id: "user-1",
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        used: true,
      },
    });

    const result = await verifyMcCode(client, "AAAAAA");

    expect(result).toEqual({ status: "already_used" });
  });

  it("returns expired when the code's expiry is in the past", async () => {
    const { client } = mockVerifyClient({
      codeRow: {
        id: "code-1",
        user_id: "user-1",
        expires_at: new Date(Date.now() - 60_000).toISOString(),
        used: false,
      },
    });

    const result = await verifyMcCode(client, "AAAAAA");

    expect(result).toEqual({ status: "expired" });
  });

  it("marks the code used and verifies the profile on success", async () => {
    const { client, updateCodes, updateProfile } = mockVerifyClient({
      codeRow: {
        id: "code-1",
        user_id: "user-1",
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        used: false,
      },
    });

    const result = await verifyMcCode(client, "AAAAAA", "mc-uuid-123");

    expect(result).toEqual({ status: "ok", userId: "user-1" });
    expect(updateCodes).toHaveBeenCalledWith({ used: true });
    expect(updateProfile).toHaveBeenCalledWith({ mc_verified: true, mc_uuid: "mc-uuid-123" });
  });

  it("omits mc_uuid from the profile update when not provided", async () => {
    const { client, updateProfile } = mockVerifyClient({
      codeRow: {
        id: "code-1",
        user_id: "user-1",
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        used: false,
      },
    });

    await verifyMcCode(client, "AAAAAA");

    expect(updateProfile).toHaveBeenCalledWith({ mc_verified: true });
  });

  it("throws when the lookup fails", async () => {
    const { client } = mockVerifyClient({ codeRow: null, lookupError: { message: "boom" } });

    await expect(verifyMcCode(client, "AAAAAA")).rejects.toThrow("verifyMcCode: boom");
  });
});
