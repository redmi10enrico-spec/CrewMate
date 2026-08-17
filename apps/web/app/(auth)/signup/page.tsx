import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Alert, Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { signUpWithEmail } from "../actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <div className="mx-auto max-w-md py-24">
        <Card title="Crea un account">
          <div className="flex flex-col gap-4">
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <form action={signUpWithEmail} className="flex flex-col gap-4">
              <FormField label="Email" htmlFor="email">
                <Input id="email" type="email" name="email" required autoComplete="email" />
              </FormField>
              <FormField label="Password" htmlFor="password" hint="Almeno 8 caratteri.">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </FormField>
              <FormField label="Nome utente Minecraft" htmlFor="mcUsername">
                <Input id="mcUsername" type="text" name="mcUsername" required />
              </FormField>
              <Button type="submit" className="w-full" icon={<UserPlus className="size-4" aria-hidden />}>
                Registrati
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Hai già un account?{" "}
            <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
              Accedi
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
