import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  createMcVerificationCode,
  generateVerificationCode,
  getProfile,
  hasRoleAtLeast,
  updateMcUsername,
} from "./profiles";

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
