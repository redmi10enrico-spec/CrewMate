import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  createPendingOrder,
  getOrderById,
  getOrderItemsWithProducts,
  listAllOrders,
  listUserOrders,
  markOrderDelivered,
  markOrderPaid,
} from "./orders";

function mockCreateOrderClient(options: {
  order: { id: string } | null;
  orderError?: { message: string } | null;
  itemsError?: { message: string } | null;
}) {
  const orderSingle = vi.fn().mockResolvedValue({ data: options.order, error: options.orderError ?? null });
  const orderSelect = vi.fn().mockReturnValue({ single: orderSingle });
  const orderInsert = vi.fn().mockReturnValue({ select: orderSelect });

  const itemsInsert = vi.fn().mockResolvedValue({ error: options.itemsError ?? null });

  const from = vi.fn((table: string) => {
    if (table === "orders") return { insert: orderInsert };
    if (table === "order_items") return { insert: itemsInsert };
    throw new Error(`unexpected table ${table}`);
  });

  return { client: { from } as unknown as SupabaseClient<Database>, orderInsert, itemsInsert };
}

describe("createPendingOrder", () => {
  it("throws when the cart is empty", async () => {
    const client = {} as SupabaseClient<Database>;
    await expect(createPendingOrder(client, "user-1", [])).rejects.toThrow(
      "createPendingOrder: il carrello è vuoto"
    );
  });

  it("inserts the order with the computed total, then the order items", async () => {
    const { client, orderInsert, itemsInsert } = mockCreateOrderClient({ order: { id: "order-1" } });

    const result = await createPendingOrder(client, "user-1", [
      { productId: "prod-1", unitPrice: 4.99, quantity: 2 },
      { productId: "prod-2", unitPrice: 2.5, quantity: 1 },
    ]);

    expect(orderInsert).toHaveBeenCalledWith({ user_id: "user-1", status: "pending", total: 12.48 });
    expect(itemsInsert).toHaveBeenCalledWith([
      { order_id: "order-1", product_id: "prod-1", unit_price: 4.99, quantity: 2 },
      { order_id: "order-1", product_id: "prod-2", unit_price: 2.5, quantity: 1 },
    ]);
    expect(result).toEqual({ id: "order-1" });
  });

  it("throws when creating the order fails", async () => {
    const { client } = mockCreateOrderClient({ order: null, orderError: { message: "boom" } });

    await expect(
      createPendingOrder(client, "user-1", [{ productId: "prod-1", unitPrice: 1, quantity: 1 }])
    ).rejects.toThrow("createPendingOrder: boom");
  });

  it("throws when inserting order items fails", async () => {
    const { client } = mockCreateOrderClient({
      order: { id: "order-1" },
      itemsError: { message: "boom" },
    });

    await expect(
      createPendingOrder(client, "user-1", [{ productId: "prod-1", unitPrice: 1, quantity: 1 }])
    ).rejects.toThrow("createPendingOrder: boom");
  });
});

describe("markOrderPaid", () => {
  it("sets status to paid with a paid_at timestamp", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await markOrderPaid(client, "order-1");

    expect(from).toHaveBeenCalledWith("orders");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "paid", paid_at: expect.any(String) })
    );
    expect(eq).toHaveBeenCalledWith("id", "order-1");
  });

  it("throws when Supabase returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(markOrderPaid(client, "order-1")).rejects.toThrow("markOrderPaid: boom");
  });
});

describe("listUserOrders", () => {
  it("filters by user and orders by created_at desc", async () => {
    const rows = [{ id: "order-1", user_id: "user-1" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listUserOrders(client, "user-1");

    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual(rows);
  });
});

describe("listAllOrders", () => {
  it("orders all rows by created_at desc", async () => {
    const rows = [{ id: "order-1" }, { id: "order-2" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listAllOrders(client);

    expect(from).toHaveBeenCalledWith("orders");
    expect(result).toEqual(rows);
  });
});

describe("getOrderById", () => {
  it("returns the order when found", async () => {
    const row = { id: "order-1", status: "paid" };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getOrderById(client, "order-1");

    expect(from).toHaveBeenCalledWith("orders");
    expect(eq).toHaveBeenCalledWith("id", "order-1");
    expect(result).toEqual(row);
  });

  it("returns null when not found", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await getOrderById(client, "missing")).toBeNull();
  });
});

describe("getOrderItemsWithProducts", () => {
  it("selects order items joined with their product", async () => {
    const rows = [{ id: "item-1", order_id: "order-1", products: { id: "prod-1", name: "VIP" } }];
    const eq = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getOrderItemsWithProducts(client, "order-1");

    expect(from).toHaveBeenCalledWith("order_items");
    expect(select).toHaveBeenCalledWith("*, products(*)");
    expect(eq).toHaveBeenCalledWith("order_id", "order-1");
    expect(result).toEqual(rows);
  });
});

describe("markOrderDelivered", () => {
  it("sets status to delivered with a delivered_at timestamp", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await markOrderDelivered(client, "order-1");

    expect(from).toHaveBeenCalledWith("orders");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "delivered", delivered_at: expect.any(String) })
    );
    expect(eq).toHaveBeenCalledWith("id", "order-1");
  });
});
