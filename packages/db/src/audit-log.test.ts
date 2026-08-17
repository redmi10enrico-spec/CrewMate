import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { logAdminAction } from "./audit-log";

describe("logAdminAction", () => {
  it("inserts an audit log row with the given fields", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await logAdminAction(client, {
      adminId: "admin-1",
      action: "update",
      entity: "server_modes",
      entityId: "mode-1",
      diff: { enabled: [true, false] },
    });

    expect(from).toHaveBeenCalledWith("audit_logs");
    expect(insert).toHaveBeenCalledWith({
      admin_id: "admin-1",
      action: "update",
      entity: "server_modes",
      entity_id: "mode-1",
      diff: { enabled: [true, false] },
    });
  });

  it("defaults entityId and diff to null when omitted", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await logAdminAction(client, { adminId: "admin-1", action: "create", entity: "products" });

    expect(insert).toHaveBeenCalledWith({
      admin_id: "admin-1",
      action: "create",
      entity: "products",
      entity_id: null,
      diff: null,
    });
  });

  it("throws when Supabase returns an error", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(
      logAdminAction(client, { adminId: "admin-1", action: "delete", entity: "products" })
    ).rejects.toThrow("logAdminAction: boom");
  });
});
