import { redirect } from "next/navigation";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { listUserApplications } from "@crewmate/db";
import { Alert, Badge, Container, SectionTitle, type BadgeTone } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  pending: "In attesa di revisione",
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

export default async function MyApplicationsPage({
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

  const applications = await listUserApplications(supabase, user.id);

  return (
    <Container>
      <div className="mx-auto max-w-2xl py-16">
        <SectionTitle subtitle="Stato delle tue candidature nello staff.">Le tue candidature</SectionTitle>
        {success ? (
          <Alert tone="success" className="mb-6">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden />
              Candidatura inviata! Ti faremo sapere appena verrà revisionata.
            </span>
          </Alert>
        ) : null}

        {applications.length === 0 ? (
          <p className="text-center text-text-muted">Non hai ancora inviato candidature.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-sm bg-accent-muted text-accent">
                    <ClipboardList className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-text">
                      {application.application_forms?.role_name ?? "Ruolo rimosso"}
                    </p>
                    <p className="text-xs text-text-dim">
                      Inviata il {new Date(application.created_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                </div>
                <Badge tone={STATUS_TONE[application.status] ?? "neutral"}>
                  {STATUS_LABEL[application.status] ?? application.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
