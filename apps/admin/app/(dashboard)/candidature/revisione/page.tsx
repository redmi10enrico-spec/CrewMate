import Link from "next/link";
import { listAllApplications } from "@crewmate/db";
import { Badge, DataTable, type BadgeTone } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";

const STATUS_LABEL: Record<string, string> = {
  pending: "In attesa",
  interview: "Colloquio",
  accepted: "Accettata",
  rejected: "Rifiutata",
};

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "warning",
  interview: "accent",
  accepted: "success",
  rejected: "danger",
};

export default async function ReviewApplicationsPage() {
  const service = createServiceRoleClient();
  const applications = await listAllApplications(service);

  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Revisione candidature</h1>
      <p className="mt-2 text-text-muted">Apri una candidatura per leggere le risposte e cambiarne lo stato.</p>

      <div className="mt-8">
        <DataTable
          columns={[
            {
              header: "Candidatura",
              cell: (application) => (
                <Link
                  href={`/candidature/revisione/${application.id}`}
                  className="font-mono text-xs text-text hover:text-accent"
                >
                  {application.id.slice(0, 8)}
                </Link>
              ),
            },
            {
              header: "Ruolo",
              cell: (application) => application.application_forms?.role_name ?? "—",
            },
            {
              header: "Data",
              cell: (application) => new Date(application.created_at).toLocaleDateString("it-IT"),
            },
            {
              header: "Stato",
              cell: (application) => (
                <Badge tone={STATUS_TONE[application.status] ?? "neutral"}>
                  {STATUS_LABEL[application.status] ?? application.status}
                </Badge>
              ),
            },
          ]}
          rows={applications}
          getRowKey={(application) => application.id}
          emptyMessage="Nessuna candidatura ricevuta ancora."
        />
      </div>
    </div>
  );
}
