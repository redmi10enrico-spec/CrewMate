import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { listServerModes } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { ServerModeForm } from "../_components/ServerModeForm";

export default async function EditServerModePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = createServiceRoleClient();
  const modes = await listServerModes(service);
  const mode = modes.find((item) => item.id === id);

  if (!mode) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica modalità</h1>
      <Card icon={<Pencil />} title={mode.name} className="mt-8">
        <ServerModeForm mode={mode} />
      </Card>
    </div>
  );
}
