import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getEnabledHomeFeatures, getEnabledServerModes, getSiteSettings } from "./site-content";

describe("getSiteSettings", () => {
  it("turns key/value rows into a plain object", async () => {
    const select = vi.fn().mockResolvedValue({
      data: [
        { key: "site_name", value: "CrewMate Network" },
        { key: "server_ip", value: "play.crewmate.net" },
      ],
      error: null,
    });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getSiteSettings(client);

    expect(from).toHaveBeenCalledWith("site_settings");
    expect(result).toEqual({ site_name: "CrewMate Network", server_ip: "play.crewmate.net" });
  });

  it("returns an empty object when there are no rows", async () => {
    const select = vi.fn().mockResolvedValue({ data: null, error: null });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getSiteSettings(client);

    expect(result).toEqual({});
  });

  it("throws when Supabase returns an error", async () => {
    const select = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getSiteSettings(client)).rejects.toThrow("getSiteSettings: boom");
  });
});

describe("getEnabledServerModes", () => {
  it("selects only enabled rows ordered by 'order'", async () => {
    const rows = [{ id: "1", name: "Survival", slug: "survival" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getEnabledServerModes(client);

    expect(from).toHaveBeenCalledWith("server_modes");
    expect(eq).toHaveBeenCalledWith("enabled", true);
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });

  it("throws when Supabase returns an error", async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getEnabledServerModes(client)).rejects.toThrow("getEnabledServerModes: boom");
  });
});

describe("getEnabledHomeFeatures", () => {
  it("selects only enabled rows ordered by 'order'", async () => {
    const rows = [{ id: "1", title: "Anti-Cheat" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getEnabledHomeFeatures(client);

    expect(from).toHaveBeenCalledWith("home_features");
    expect(result).toEqual(rows);
  });

  it("throws when Supabase returns an error", async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getEnabledHomeFeatures(client)).rejects.toThrow("getEnabledHomeFeatures: boom");
  });
});
