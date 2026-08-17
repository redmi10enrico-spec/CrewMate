import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ProductCommandRow = Database["public"]["Tables"]["product_commands"]["Row"];
export type ProductCommandInput = Database["public"]["Tables"]["product_commands"]["Insert"];
export type DeliveryLogRow = Database["public"]["Tables"]["delivery_logs"]["Row"];

export async function listProductCommands(
  client: SupabaseClient<Database>,
  productId: string
): Promise<ProductCommandRow[]> {
  const { data, error } = await client
    .from("product_commands")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`listProductCommands: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertProductCommand(
  client: SupabaseClient<Database>,
  input: ProductCommandInput
): Promise<ProductCommandRow> {
  const { data, error } = await client.from("product_commands").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertProductCommand: ${error.message}`);
  }

  return data;
}

export async function deleteProductCommand(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("product_commands").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteProductCommand: ${error.message}`);
  }
}

export interface DeliveryLogInput {
  orderId: string;
  command: string;
  response?: string | null;
  success: boolean;
}

export async function logDelivery(client: SupabaseClient<Database>, input: DeliveryLogInput): Promise<void> {
  const { error } = await client.from("delivery_logs").insert({
    order_id: input.orderId,
    command: input.command,
    response: input.response ?? null,
    success: input.success,
  });

  if (error) {
    throw new Error(`logDelivery: ${error.message}`);
  }
}

export async function listDeliveryLogs(
  client: SupabaseClient<Database>,
  orderId: string
): Promise<DeliveryLogRow[]> {
  const { data, error } = await client
    .from("delivery_logs")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`listDeliveryLogs: ${error.message}`);
  }

  return data ?? [];
}
