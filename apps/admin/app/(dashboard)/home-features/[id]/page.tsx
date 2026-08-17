import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { listHomeFeatures } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { HomeFeatureForm } from "../_components/HomeFeatureForm";

export default async function EditHomeFeaturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = createServiceRoleClient();
  const features = await listHomeFeatures(service);
  const feature = features.find((item) => item.id === id);

  if (!feature) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica feature</h1>
      <Card icon={<Pencil />} title={feature.title} className="mt-8">
        <HomeFeatureForm feature={feature} />
      </Card>
    </div>
  );
}
