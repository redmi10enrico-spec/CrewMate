import {
  getOrderById,
  getOrderItemsWithProducts,
  getProfile,
  listProductCommands,
  logDelivery,
  markOrderDelivered,
} from "@crewmate/db";
import { createServiceRoleClient } from "./supabase/service";
import { executeRconCommands } from "./rcon";

export interface DeliverOrderResult {
  delivered: boolean;
  reason?: string;
}

/**
 * Esegue i comandi RCON di tutti i prodotti di un ordine pagato,
 * sostituendo {player}/{uuid} con i dati del nick Minecraft verificato
 * dell'acquirente (brief §11: "consegna solo su ordini paid e nick
 * verificato"). Segna l'ordine 'delivered' solo se tutti i comandi
 * vanno a buon fine; altrimenti resta com'era, ri-consegnabile
 * manualmente dall'admin.
 */
export async function deliverOrder(orderId: string): Promise<DeliverOrderResult> {
  const service = createServiceRoleClient();

  const order = await getOrderById(service, orderId);
  if (!order) {
    return { delivered: false, reason: "Ordine non trovato" };
  }
  if (order.status !== "paid" && order.status !== "delivered") {
    return { delivered: false, reason: `L'ordine è in stato "${order.status}", non "paid"` };
  }

  const profile = await getProfile(service, order.user_id);
  if (!profile?.mc_username || !profile.mc_verified) {
    return { delivered: false, reason: "Il nome Minecraft dell'acquirente non è verificato" };
  }

  const items = await getOrderItemsWithProducts(service, orderId);
  const commands: string[] = [];
  for (const item of items) {
    if (!item.product_id) continue;
    const productCommands = await listProductCommands(service, item.product_id);
    for (const productCommand of productCommands) {
      for (let i = 0; i < item.quantity; i++) {
        commands.push(
          productCommand.command
            .replaceAll("{player}", profile.mc_username)
            .replaceAll("{uuid}", profile.mc_uuid ?? "")
        );
      }
    }
  }

  if (commands.length === 0) {
    return { delivered: false, reason: "Nessun comando di consegna configurato per questo ordine" };
  }

  const results = await executeRconCommands(commands);

  for (let i = 0; i < commands.length; i++) {
    await logDelivery(service, {
      orderId,
      command: commands[i],
      response: results[i].response,
      success: results[i].success,
    });
  }

  const allSucceeded = results.every((result) => result.success);
  if (allSucceeded) {
    await markOrderDelivered(service, orderId);
  }

  return {
    delivered: allSucceeded,
    reason: allSucceeded ? undefined : "Uno o più comandi RCON sono falliti (vedi log di consegna)",
  };
}
