import { Button, Card, Container, FormField, Input } from "@crewmate/ui";
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
        <Card title="Accedi al pannello admin">
          {errorMessage ? <p className="mb-4 text-sm text-danger">{errorMessage}</p> : null}
          <form action={signInWithEmail} className="flex flex-col gap-4">
            <FormField label="Email" htmlFor="email">
              <Input id="email" type="email" name="email" required />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <Input id="password" type="password" name="password" required />
            </FormField>
            <Button type="submit">Accedi</Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
