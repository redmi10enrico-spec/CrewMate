import Link from "next/link";
import { LogIn, MessageCircle } from "lucide-react";
import { Alert, Button, Card, Container, FormField, Input } from "@crewmate/ui";
import { signInWithDiscord, signInWithEmail } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container>
      <div className="mx-auto max-w-md py-24">
        <Card title="Bentornato">
          <div className="flex flex-col gap-4">
            {error ? <Alert tone="danger">{error}</Alert> : null}
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

            <div className="flex items-center gap-3 text-xs text-text-dim">
              <span className="h-px flex-1 bg-border" />
              oppure
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={signInWithDiscord}>
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                icon={<MessageCircle className="size-4" aria-hidden />}
              >
                Accedi con Discord
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Non hai un account?{" "}
            <Link href="/signup" className="font-medium text-accent hover:text-accent-hover">
              Registrati
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
