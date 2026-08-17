import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ProductCategoryRow = Database["public"]["Tables"]["product_categories"]["Row"];
export type ProductCategoryInput = Database["public"]["Tables"]["product_categories"]["Insert"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInput = Database["public"]["Tables"]["products"]["Insert"];
export type ProductFeatureRow = Database["public"]["Tables"]["product_features"]["Row"];
export type ProductFeatureInput = Database["public"]["Tables"]["product_features"]["Insert"];

export interface ProductWithFeatures extends ProductRow {
  product_features: ProductFeatureRow[];
}

// --- Lettura pubblica -------------------------------------------------

export async function getProductCategories(
  client: SupabaseClient<Database>
): Promise<ProductCategoryRow[]> {
  const { data, error } = await client
    .from("product_categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getProductCategories: ${error.message}`);
  }

  return data ?? [];
}

export async function getEnabledProductsWithFeatures(
  client: SupabaseClient<Database>
): Promise<ProductWithFeatures[]> {
  const { data, error } = await client
    .from("products")
    .select("*, product_features(*)")
    .eq("enabled", true)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getEnabledProductsWithFeatures: ${error.message}`);
  }

  return (data ?? []) as unknown as ProductWithFeatures[];
}

// --- Scritture per il pannello admin (client service-role) ------------
// La lettura delle categorie è la stessa per pubblico e admin (nessuna
// colonna enabled su product_categories): riusa getProductCategories.

export async function upsertProductCategory(
  client: SupabaseClient<Database>,
  input: ProductCategoryInput
): Promise<ProductCategoryRow> {
  const { data, error } = await client.from("product_categories").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertProductCategory: ${error.message}`);
  }

  return data;
}

export async function deleteProductCategory(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("product_categories").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteProductCategory: ${error.message}`);
  }
}

export async function listProducts(client: SupabaseClient<Database>): Promise<ProductRow[]> {
  const { data, error } = await client.from("products").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`listProducts: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertProduct(
  client: SupabaseClient<Database>,
  input: ProductInput
): Promise<ProductRow> {
  const { data, error } = await client.from("products").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertProduct: ${error.message}`);
  }

  return data;
}

export async function deleteProduct(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteProduct: ${error.message}`);
  }
}

export async function setProductEnabled(
  client: SupabaseClient<Database>,
  id: string,
  enabled: boolean
): Promise<void> {
  const { error } = await client.from("products").update({ enabled }).eq("id", id);

  if (error) {
    throw new Error(`setProductEnabled: ${error.message}`);
  }
}

export async function listProductFeatures(
  client: SupabaseClient<Database>,
  productId: string
): Promise<ProductFeatureRow[]> {
  const { data, error } = await client
    .from("product_features")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`listProductFeatures: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertProductFeature(
  client: SupabaseClient<Database>,
  input: ProductFeatureInput
): Promise<ProductFeatureRow> {
  const { data, error } = await client.from("product_features").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertProductFeature: ${error.message}`);
  }

  return data;
}

export async function deleteProductFeature(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("product_features").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteProductFeature: ${error.message}`);
  }
}
