import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { getProductCategories } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryForm } from "../_components/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const categories = await getProductCategories(supabase);
  const category = categories.find((item) => item.id === id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Modifica categoria</h1>
      <Card icon={<Pencil />} title={category.name} className="mt-8">
        <CategoryForm category={category} />
      </Card>
    </div>
  );
}
