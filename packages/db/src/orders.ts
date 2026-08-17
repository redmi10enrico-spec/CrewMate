import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export interface CartLine {
  productId: string;
  unitPrice: number;
  quantity: number;
}

/**
 * Crea un ordine 'pending' con le sue righe. Va chiamata con il client
 * dell'utente autenticato: la RLS permette solo di inserire ordini
 * propri con status 'pending'.
 */
export async function createPendingOrder(
  client: SupabaseClient<Database>,
  userId: string,
  lines: CartLine[]
): Promise<OrderRow> {
  if (lines.length === 0) {
    throw new Error("createPendingOrder: il carrello è vuoto");
  }

  const total = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({ user_id: userId, status: "pending", total })
    .select()
    .single();

  if (orderError) {
    throw new Error(`createPendingOrder: ${orderError.message}`);
  }

  const { error: itemsError } = await client.from("order_items").insert(
    lines.map((line) => ({
      order_id: order.id,
      product_id: line.productId,
      unit_price: line.unitPrice,
      quantity: line.quantity,
    }))
  );

  if (itemsError) {
    throw new Error(`createPendingOrder: ${itemsError.message}`);
  }

  return order;
}

/**
 * Simula il completamento del pagamento. Va chiamata con un client
 * service-role: nessun utente può marcare da solo un proprio ordine
 * come pagato. Nella Fase 10 questo stesso punto verrà richiamato dal
 * webhook del gateway di pagamento reale.
 */
export async function markOrderPaid(client: SupabaseClient<Database>, orderId: string): Promise<void> {
  const { error } = await client
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    throw new Error(`markOrderPaid: ${error.message}`);
  }
}

export async function listUserOrders(
  client: SupabaseClient<Database>,
  userId: string
): Promise<OrderRow[]> {
  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`listUserOrders: ${error.message}`);
  }

  return data ?? [];
}

/** Solo per il pannello admin (client service-role): tutti gli ordini. */
export async function listAllOrders(client: SupabaseClient<Database>): Promise<OrderRow[]> {
  const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false });

  if (error) {
    throw new Error(`listAllOrders: ${error.message}`);
  }

  return data ?? [];
}
