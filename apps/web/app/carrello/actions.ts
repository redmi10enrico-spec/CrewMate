"use server";

import { redirect } from "next/navigation";
import { createPendingOrder, type CartLine } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function checkout(lines: CartLine[]) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (lines.length === 0) {
    redirect("/carrello?error=empty");
  }

  const order = await createPendingOrder(supabase, user.id, lines);

  const adminUrl = process.env.ADMIN_INTERNAL_URL;
  const secret = process.env.ORDER_SIMULATE_SECRET;
  if (adminUrl && secret) {
    try {
      await fetch(`${adminUrl}/api/orders/simulate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Order-Simulate-Secret": secret },
        body: JSON.stringify({ orderId: order.id }),
      });
    } catch {
      // Simulazione pagamento non raggiungibile: l'ordine resta 'pending',
      // visibile e correggibile manualmente dall'admin.
    }
  }

  redirect(`/account/ordini?success=${order.id}`);
}
