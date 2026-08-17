import { LogIn, ShieldCheck } from "lucide-react";
import { Alert, Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { signInWithEmail } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  "not-admin": "Il tuo account non ha i permessi di amministratore.",
  error: "Si è verificato un errore, riprova.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? error) : null;

  return (
    <Container>
      <div className="mx-auto max-w-md py-24">
        <Card icon={<ShieldCheck />} title="Pannello Admin">
          <div className="flex flex-col gap-4">
            {errorMessage ? <Alert tone="danger">{errorMessage}</Alert> : null}
            <form action={signInWithEmail} className="flex flex-col gap-4">
              <FormField label="Email" htmlFor="email">
                <Input id="email" type="email" name="email" required autoComplete="email" />
              </FormField>
              <FormField label="Password" htmlFor="password">
                <Input id="password" type="password" name="password" required autoComplete="current-password" />
              </FormField>
              <Button type="submit" className="w-full" icon={<LogIn className="size-4" aria-hidden />}>
                Accedi
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Container>
  );
}
