import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@crewmate/db";
import { markOrderPaid } from "@crewmate/db";
import { deliverOrder } from "@/lib/delivery";

/**
 * Endpoint server-to-server che conferma il pagamento di un ordine e ne
 * avvia la consegna via RCON. Oggi viene chiamato subito dopo il
 * checkout in apps/web per simulare un pagamento riuscito (nessun
 * gateway reale ancora collegato). In Fase 10 lo stesso punto verrà
 * richiamato dal webhook del gateway di pagamento vero, senza cambiare
 * la logica di dominio (markOrderPaid + deliverOrder).
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-order-simulate-secret");
  if (!secret || secret !== process.env.ORDER_SIMULATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId : null;
  if (!orderId) {
    return NextResponse.json({ error: "missing orderId" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);
  await markOrderPaid(supabase, orderId);

  const delivery = await deliverOrder(orderId);

  return NextResponse.json({ success: true, delivered: delivery.delivered, reason: delivery.reason });
}
