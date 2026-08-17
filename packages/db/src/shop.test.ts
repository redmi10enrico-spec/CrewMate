import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  deleteProduct,
  deleteProductCategory,
  deleteProductFeature,
  getEnabledProductsWithFeatures,
  getProductCategories,
  listProductFeatures,
  listProducts,
  setProductEnabled,
  upsertProduct,
  upsertProductCategory,
  upsertProductFeature,
} from "./shop";

function mockSelectChain(finalMethod: "order" | "eqThenOrder", result: { data: unknown; error: unknown }) {
  if (finalMethod === "order") {
    const order = vi.fn().mockResolvedValue(result);
    const select = vi.fn().mockReturnValue({ order });
    return { select, order };
  }
  const order = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ eq });
  return { select, eq, order };
}

describe("getProductCategories", () => {
  it("orders categories by 'order'", async () => {
    const rows = [{ id: "1", name: "Ranghi", slug: "ranghi", order: 1 }];
    const { select, order } = mockSelectChain("order", { data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getProductCategories(client);

    expect(from).toHaveBeenCalledWith("product_categories");
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });
});

describe("getEnabledProductsWithFeatures", () => {
  it("selects enabled products with their features, ordered", async () => {
    const rows = [{ id: "1", name: "VIP", enabled: true, product_features: [] }];
    const { select, eq, order } = mockSelectChain("eqThenOrder", { data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getEnabledProductsWithFeatures(client);

    expect(from).toHaveBeenCalledWith("products");
    expect(select).toHaveBeenCalledWith("*, product_features(*)");
    expect(eq).toHaveBeenCalledWith("enabled", true);
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });

  it("throws when Supabase returns an error", async () => {
    const { select } = mockSelectChain("eqThenOrder", { data: null, error: { message: "boom" } });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getEnabledProductsWithFeatures(client)).rejects.toThrow(
      "getEnabledProductsWithFeatures: boom"
    );
  });
});

describe("upsertProductCategory / deleteProductCategory", () => {
  it("upserts and returns the row", async () => {
    const row = { id: "1", name: "Ranghi", slug: "ranghi", order: 1 };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertProductCategory(client, { name: "Ranghi", slug: "ranghi" });

    expect(result).toEqual(row);
  });

  it("deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteProductCategory(client, "cat-1");

    expect(from).toHaveBeenCalledWith("product_categories");
    expect(eq).toHaveBeenCalledWith("id", "cat-1");
  });
});

describe("listProducts / upsertProduct / deleteProduct / setProductEnabled", () => {
  it("lists all products ordered, regardless of enabled", async () => {
    const rows = [{ id: "1", name: "VIP", enabled: false }];
    const { select, order } = mockSelectChain("order", { data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listProducts(client);

    expect(from).toHaveBeenCalledWith("products");
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });

  it("upserts a product", async () => {
    const row = { id: "1", name: "VIP" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertProduct(client, { name: "VIP", price: 4.99 });

    expect(result).toEqual(row);
  });

  it("deletes a product by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteProduct(client, "prod-1");

    expect(eq).toHaveBeenCalledWith("id", "prod-1");
  });

  it("sets the enabled column only", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setProductEnabled(client, "prod-1", false);

    expect(update).toHaveBeenCalledWith({ enabled: false });
    expect(eq).toHaveBeenCalledWith("id", "prod-1");
  });
});

describe("listProductFeatures / upsertProductFeature / deleteProductFeature", () => {
  it("lists features for a product ordered", async () => {
    const rows = [{ id: "1", product_id: "prod-1", text: "Prefix", order: 1 }];
    const { select, eq, order } = mockSelectChain("eqThenOrder", { data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listProductFeatures(client, "prod-1");

    expect(from).toHaveBeenCalledWith("product_features");
    expect(eq).toHaveBeenCalledWith("product_id", "prod-1");
    expect(order).toHaveBeenCalledWith("order", { ascending: true });
    expect(result).toEqual(rows);
  });

  it("upserts a feature", async () => {
    const row = { id: "1", product_id: "prod-1", text: "Prefix", order: 1 };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await upsertProductFeature(client, { product_id: "prod-1", text: "Prefix" });

    expect(result).toEqual(row);
  });

  it("deletes a feature by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteProductFeature(client, "feat-1");

    expect(eq).toHaveBeenCalledWith("id", "feat-1");
  });
});
