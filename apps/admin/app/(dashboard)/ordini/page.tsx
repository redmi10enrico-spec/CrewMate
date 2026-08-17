import Link from "next/link";
import { listAllOrders } from "@crewmate/db";
import { Badge, DataTable, type BadgeTone } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";

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

export default async function OrdersPage() {
  // Service role: la RLS lascia leggere solo i propri ordini, l'admin deve
  // vederli tutti.
  const service = createServiceRoleClient();
  const orders = await listAllOrders(service);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Ordini</h1>
      <p className="mt-2 text-text-muted">
        Storico degli ordini dello Shop. Apri un ordine per vedere il log di consegna o ri-eseguirla.
      </p>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Ordine",
              cell: (order) => (
                <Link href={`/ordini/${order.id}`} className="font-mono text-xs text-text hover:text-accent">
                  {order.id.slice(0, 8)}
                </Link>
              ),
            },
            {
              header: "Data",
              cell: (order) => new Date(order.created_at).toLocaleDateString("it-IT"),
            },
            { header: "Totale", cell: (order) => `${order.total.toFixed(2)}€` },
            {
              header: "Stato",
              cell: (order) => (
                <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </Badge>
              ),
            },
          ]}
          rows={orders}
          getRowKey={(order) => order.id}
          emptyMessage="Nessun ordine ancora."
        />
      </div>
    </div>
  );
}
