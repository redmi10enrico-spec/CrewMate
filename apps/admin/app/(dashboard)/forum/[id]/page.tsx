import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { getForumCategories } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { ForumCategoryForm } from "../_components/ForumCategoryForm";

export default async function EditForumCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = createServiceRoleClient();
  const categories = await getForumCategories(service);
  const category = categories.find((item) => item.id === id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica categoria</h1>
      <Card icon={<Pencil />} title={category.name} className="mt-8">
        <ForumCategoryForm category={category} />
      </Card>
    </div>
  );
}
