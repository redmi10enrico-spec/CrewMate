import { ArrowRight } from "lucide-react";
import { Alert, Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { saveMcUsername } from "./actions";

export default async function McUsernameOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <div className="mx-auto max-w-md py-24">
        <Card title="Un ultimo passo">
          <p className="mb-4 text-text-muted">
            Con Discord non ci hai ancora detto il tuo nome Minecraft: ci serve per collegare i tuoi
            acquisti e la verifica in gioco.
          </p>
          <div className="flex flex-col gap-4">
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <form action={saveMcUsername} className="flex flex-col gap-4">
              <FormField label="Nome utente Minecraft" htmlFor="mcUsername">
                <Input id="mcUsername" type="text" name="mcUsername" required />
              </FormField>
              <Button type="submit" className="w-full" icon={<ArrowRight className="size-4" aria-hidden />}>
                Continua
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}
