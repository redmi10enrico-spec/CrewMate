import { PlusCircle } from "lucide-react";
import { Card } from "@crewmate/ui";
import { CategoryForm } from "../_components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Nuova categoria</h1>
      <Card icon={<PlusCircle />} title="Dettagli" className="mt-8">
        <CategoryForm />
      </Card>
    </div>
  );
}
