import { PlusCircle } from "lucide-react";
import { Card } from "@crewmate/ui";
import { ApplicationFormForm } from "../_components/ApplicationFormForm";

export default function NewApplicationFormPage() {
  return (
    <div className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Nuovo modulo</h1>
      <Card icon={<PlusCircle />} title="Dettagli" className="mt-8">
        <ApplicationFormForm />
      </Card>
    </div>
  );
}
