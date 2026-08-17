import { redirect } from "next/navigation";
import { getProfile } from "@crewmate/db";
import { Badge, Button, Card, Container, SectionTitle } from "@crewmate/ui";
import { KeyRound, LogOut, ShieldAlert, ShieldCheck } from "lucide-react";
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
      <div className="mx-auto max-w-lg py-24">
        <SectionTitle subtitle="Gestisci il tuo profilo CrewMate Network.">Il tuo account</SectionTitle>
        <Card title="Profilo">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-text-muted">Nome Minecraft</span>
            <span className="font-medium text-text">{profile?.mc_username ?? "non impostato"}</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-sm text-text-muted">Verifica</span>
            {profile?.mc_verified ? (
              <Badge tone="success" icon={<ShieldCheck />}>
                Verificato
              </Badge>
            ) : (
              <Badge tone="warning" icon={<ShieldAlert />}>
                Non verificato
              </Badge>
            )}
          </div>

          {!profile?.mc_verified ? (
            <div className="border-t border-border pt-4">
              {code ? (
                <p className="mb-4 rounded-sm border border-accent/30 bg-accent-muted p-4 text-center text-sm text-text">
                  Digita in gioco <code className="font-mono text-accent">/verify {code}</code>
                  <br />
                  <span className="text-text-muted">Il codice scade tra 15 minuti.</span>
                </p>
              ) : null}
              <form action={requestMcVerificationCode}>
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                  icon={<KeyRound className="size-4" aria-hidden />}
                >
                  Richiedi codice di verifica
                </Button>
              </form>
            </div>
          ) : null}

          <form action={signOut} className="mt-6 border-t border-border pt-6">
            <Button
              type="submit"
              variant="ghost"
              className="w-full"
              icon={<LogOut className="size-4" aria-hidden />}
            >
              Esci
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
