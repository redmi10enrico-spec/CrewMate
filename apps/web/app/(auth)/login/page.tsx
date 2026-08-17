import Link from "next/link";
import { Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { signInWithDiscord, signInWithEmail } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <div className="mx-auto max-w-md py-20">
        <Card title="Accedi">
          {error ? <p className="mb-4 text-sm text-danger">{error}</p> : null}
          <form action={signInWithEmail} className="flex flex-col gap-4">
            <FormField label="Email" htmlFor="email">
              <Input id="email" type="email" name="email" required />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <Input id="password" type="password" name="password" required />
            </FormField>
            <Button type="submit">Accedi</Button>
          </form>
          <form action={signInWithDiscord} className="mt-4">
            <Button type="submit" variant="outline" className="w-full">
              Accedi con Discord
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-text-muted">
            Non hai un account?{" "}
            <Link href="/signup" className="text-accent">
              Registrati
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
