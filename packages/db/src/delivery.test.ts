import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  deleteProductCommand,
  listDeliveryLogs,
  listProductCommands,
  logDelivery,
  upsertProductCommand,
} from "./delivery";

describe("listProductCommands", () => {
  it("filters by product and orders by 'order'", async () => {
    const rows = [{ id: "1", product_id: "prod-1", command: "lp user {player} parent add vip", order: 1 }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listProductCommands(client, "prod-1");

    expect(from).toHaveBeenCalledWith("product_commands");
    expect(eq).toHaveBeenCalledWith("product_id", "prod-1");
    expect(result).toEqual(rows);
  });
});

describe("upsertProductCommand / deleteProductCommand", () => {
  it("upserts and returns the row", async () => {
    const row = { id: "1", product_id: "prod-1", command: "lp user {player} parent add vip", order: 1 };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertProductCommand(client, {
      product_id: "prod-1",
      command: "lp user {player} parent add vip",
    });

    expect(result).toEqual(row);
  });

  it("deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteProductCommand(client, "cmd-1");

    expect(eq).toHaveBeenCalledWith("id", "cmd-1");
  });
});

describe("logDelivery", () => {
  it("inserts a delivery log row", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await logDelivery(client, {
      orderId: "order-1",
      command: "lp user Steve parent add vip",
      response: "OK",
      success: true,
    });

    expect(from).toHaveBeenCalledWith("delivery_logs");
    expect(insert).toHaveBeenCalledWith({
      order_id: "order-1",
      command: "lp user Steve parent add vip",
      response: "OK",
      success: true,
    });
  });

  it("defaults response to null when omitted", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await logDelivery(client, { orderId: "order-1", command: "cmd", success: false });

    expect(insert).toHaveBeenCalledWith({
      order_id: "order-1",
      command: "cmd",
      response: null,
      success: false,
    });
  });

  it("throws when Supabase returns an error", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(
      logDelivery(client, { orderId: "order-1", command: "cmd", success: false })
    ).rejects.toThrow("logDelivery: boom");
  });
});

describe("listDeliveryLogs", () => {
  it("filters by order and orders chronologically", async () => {
    const rows = [{ id: "1", order_id: "order-1", command: "cmd", response: null, success: true }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listDeliveryLogs(client, "order-1");

    expect(eq).toHaveBeenCalledWith("order_id", "order-1");
    expect(order).toHaveBeenCalledWith("created_at", { ascending: true });
    expect(result).toEqual(rows);
  });
});
