import { notFound } from "next/navigation";
import { RefreshCw, ScrollText } from "lucide-react";
import {
  getOrderById,
  getOrderItemsWithProducts,
  getProfile,
  listDeliveryLogs,
} from "@crewmate/db";
import { Badge, Button, Card, type BadgeTone } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { redeliverOrderAction } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  pending: "In attesa",
  paid: "Pagato",
  delivered: "Consegnato",
  failed: "Fallito",
  refunded: "Rimborsato",
};

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "warning",
  paid: "success",
  delivered: "success",
  failed: "danger",
  refunded: "neutral",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = createServiceRoleClient();

  const order = await getOrderById(service, id);
  if (!order) {
    notFound();
  }

  const [items, logs, buyer] = await Promise.all([
    getOrderItemsWithProducts(service, id),
    listDeliveryLogs(service, id),
    getProfile(service, order.user_id),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            Ordine #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-text-muted">
            {buyer?.mc_username ?? "Utente sconosciuto"} · {new Date(order.created_at).toLocaleString("it-IT")}
          </p>
        </div>
        <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>{STATUS_LABEL[order.status] ?? order.status}</Badge>
      </div>

      <Card title="Prodotti" className="mt-8">
        <div className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <span className="text-text">
                {item.quantity} × {item.products?.name ?? "Prodotto rimosso"}
              </span>
              <span className="font-medium text-text">{(item.unit_price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-text-muted">Totale</span>
          <span className="text-lg font-semibold text-text">{order.total.toFixed(2)}€</span>
        </div>
      </Card>

      {order.status === "paid" || order.status === "delivered" ? (
        <form action={redeliverOrderAction} className="mt-6">
          <input type="hidden" name="order_id" value={order.id} />
          <Button type="submit" variant="secondary" icon={<RefreshCw className="size-4" aria-hidden />}>
            {order.status === "delivered" ? "Ri-esegui consegna" : "Consegna ora"}
          </Button>
        </form>
      ) : null}

      <Card icon={<ScrollText />} title="Log di consegna" className="mt-6">
        {logs.length === 0 ? (
          <p className="text-sm text-text-dim">Nessuna consegna ancora tentata.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div key={log.id} className="rounded-sm border border-border bg-surface-alt p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-text">{log.command}</span>
                  <Badge tone={log.success ? "success" : "danger"}>{log.success ? "OK" : "Errore"}</Badge>
                </div>
                {log.response ? <p className="mt-1 text-xs text-text-dim">{log.response}</p> : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
