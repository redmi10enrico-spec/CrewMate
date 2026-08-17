import { redirect } from "next/navigation";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { listUserOrders } from "@crewmate/db";
import { Alert, Badge, Container, SectionTitle, type BadgeTone } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await listUserOrders(supabase, user.id);

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-16">
        <SectionTitle subtitle="Storico dei tuoi acquisti su CrewMate Network.">I tuoi ordini</SectionTitle>
        {success ? (
          <Alert tone="success" className="mb-6">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden />
              Ordine confermato!
            </span>
          </Alert>
        ) : null}

        {orders.length === 0 ? (
          <p className="text-center text-text-muted">Non hai ancora effettuato ordini.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-sm bg-accent-muted text-accent">
                    <PackageCheck className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-text">
                      {new Date(order.created_at).toLocaleDateString("it-IT")}
                    </p>
                    <p className="text-xs text-text-dim">Ordine #{order.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-text">{order.total.toFixed(2)}€</span>
                  <Badge tone={STATUS_TONE[order.status] ?? "neutral"}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
