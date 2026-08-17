import { PlusCircle } from "lucide-react";
import { getProductCategories } from "@crewmate/db";
import { Card } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProductForm } from "../_components/ProductForm";

export default async function NewProductPage() {
  const supabase = await createSupabaseServerClient();
  const categories = await getProductCategories(supabase);

  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Nuovo prodotto</h1>
      <Card icon={<PlusCircle />} title="Dettagli" className="mt-8">
        <ProductForm categories={categories} />
      </Card>
    </div>
  );
}
