import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  deleteHomeFeature,
  deleteServerMode,
  getEnabledHomeFeatures,
  getEnabledServerModes,
  getSiteSettings,
  listHomeFeatures,
  listServerModes,
  setHomeFeatureEnabled,
  setServerModeEnabled,
  upsertHomeFeature,
  upsertServerMode,
  upsertSiteSettings,
} from "./site-content";

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

describe("upsertSiteSettings", () => {
  it("upserts each entry keyed by 'key'", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await upsertSiteSettings(client, { site_name: "CrewMate", server_ip: "play.crewmate.net" });

    expect(from).toHaveBeenCalledWith("site_settings");
    expect(upsert).toHaveBeenCalledWith(
      [
        { key: "site_name", value: "CrewMate" },
        { key: "server_ip", value: "play.crewmate.net" },
      ],
      { onConflict: "key" }
    );
  });

  it("throws when Supabase returns an error", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(upsertSiteSettings(client, { site_name: "CrewMate" })).rejects.toThrow(
      "upsertSiteSettings: boom"
    );
  });
});

describe("listServerModes", () => {
  it("selects all rows ordered by 'order', enabled or not", async () => {
    const rows = [{ id: "1", name: "Survival", enabled: false }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listServerModes(client);

    expect(from).toHaveBeenCalledWith("server_modes");
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });
});

describe("upsertServerMode", () => {
  it("upserts and returns the row", async () => {
    const row = { id: "1", name: "Survival" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertServerMode(client, { name: "Survival", slug: "survival", description: "" });

    expect(from).toHaveBeenCalledWith("server_modes");
    expect(result).toEqual(row);
  });

  it("throws when Supabase returns an error", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(
      upsertServerMode(client, { name: "Survival", slug: "survival", description: "" })
    ).rejects.toThrow("upsertServerMode: boom");
  });
});

describe("deleteServerMode", () => {
  it("deletes the row by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteServerMode(client, "mode-1");

    expect(from).toHaveBeenCalledWith("server_modes");
    expect(eq).toHaveBeenCalledWith("id", "mode-1");
  });

  it("throws when Supabase returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(deleteServerMode(client, "mode-1")).rejects.toThrow("deleteServerMode: boom");
  });
});

describe("setServerModeEnabled", () => {
  it("updates only the enabled column", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setServerModeEnabled(client, "mode-1", false);

    expect(from).toHaveBeenCalledWith("server_modes");
    expect(update).toHaveBeenCalledWith({ enabled: false });
    expect(eq).toHaveBeenCalledWith("id", "mode-1");
  });

  it("throws when Supabase returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(setServerModeEnabled(client, "mode-1", false)).rejects.toThrow(
      "setServerModeEnabled: boom"
    );
  });
});

describe("listHomeFeatures", () => {
  it("selects all rows ordered by 'order', enabled or not", async () => {
    const rows = [{ id: "1", title: "Anti-Cheat", enabled: false }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listHomeFeatures(client);

    expect(from).toHaveBeenCalledWith("home_features");
    expect(result).toEqual(rows);
  });
});

describe("upsertHomeFeature", () => {
  it("upserts and returns the row", async () => {
    const row = { id: "1", title: "Anti-Cheat" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertHomeFeature(client, { title: "Anti-Cheat", description: "" });

    expect(from).toHaveBeenCalledWith("home_features");
    expect(result).toEqual(row);
  });
});

describe("deleteHomeFeature", () => {
  it("deletes the row by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteHomeFeature(client, "feature-1");

    expect(from).toHaveBeenCalledWith("home_features");
    expect(eq).toHaveBeenCalledWith("id", "feature-1");
  });
});

describe("setHomeFeatureEnabled", () => {
  it("updates only the enabled column", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setHomeFeatureEnabled(client, "feature-1", true);

    expect(from).toHaveBeenCalledWith("home_features");
    expect(update).toHaveBeenCalledWith({ enabled: true });
    expect(eq).toHaveBeenCalledWith("id", "feature-1");
  });
});
