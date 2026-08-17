import Link from "next/link";
import { Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { signUpWithEmail } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <div className="mx-auto max-w-md py-20">
        <Card title="Crea un account">
          {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
          <form action={signUpWithEmail} className="flex flex-col gap-4">
            <FormField label="Email" htmlFor="email">
              <Input id="email" type="email" name="email" required />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <Input id="password" type="password" name="password" required minLength={8} />
            </FormField>
            <FormField label="Nome utente Minecraft" htmlFor="mcUsername">
              <Input id="mcUsername" type="text" name="mcUsername" required />
            </FormField>
            <Button type="submit">Registrati</Button>
          </form>
          <p className="mt-6 text-center text-sm text-text-muted">
            Hai già un account?{" "}
            <Link href="/login" className="text-accent">
              Accedi
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
