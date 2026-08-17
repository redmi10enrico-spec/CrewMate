import { redirect } from "next/navigation";
import { getProfile } from "@crewmate/db";
import { Badge, Button, Card, Container, SectionTitle } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "../(auth)/actions";
import { requestMcVerificationCode } from "./actions";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(supabase, user.id);

  return (
    <Container>
      <div className="mx-auto max-w-lg py-20">
        <SectionTitle subtitle="Gestisci il tuo profilo CrewMate Network.">Il tuo account</SectionTitle>
        <Card title="Profilo">
          <p className="text-text-muted">
            Nome Minecraft:{" "}
            <span className="text-text">{profile?.mc_username ?? "non impostato"}</span>
          </p>
          <p className="mt-2 text-text-muted">
            Verifica:{" "}
            {profile?.mc_verified ? (
              <Badge tone="green">Verificato</Badge>
            ) : (
              <Badge tone="warning">Non verificato</Badge>
            )}
          </p>

          {!profile?.mc_verified ? (
            <div className="mt-6">
              {code ? (
                <p className="mb-4 rounded border border-accent-soft bg-surface p-4 text-center">
                  Digita in gioco <code className="text-accent">/verify {code}</code>
                  <br />
                  <span className="text-sm text-text-muted">Il codice scade tra 15 minuti.</span>
                </p>
              ) : null}
              <form action={requestMcVerificationCode}>
                <Button type="submit" variant="outline">
                  Richiedi codice di verifica
                </Button>
              </form>
            </div>
          ) : null}

          <form action={signOut} className="mt-8">
            <Button type="submit" variant="outline">
              Esci
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
