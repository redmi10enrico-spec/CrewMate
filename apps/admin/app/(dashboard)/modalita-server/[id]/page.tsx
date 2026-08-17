import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { listServerModes } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServerModeForm } from "../_components/ServerModeForm";

export default async function EditServerModePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const modes = await listServerModes(supabase);
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
