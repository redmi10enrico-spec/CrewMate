import type { ReactNode } from "react";
import Link from "next/link";
import { Button, Container } from "@crewmate/ui";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getProfile } from "@crewmate/db";
import { signOut } from "./actions";

const NAV_ITEMS = [{ href: "/", label: "Dashboard" }];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <>
      <header className="border-b border-border bg-bg-800">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/" className="font-title text-sm text-text">
              CrewMate Admin
            </Link>
            <nav>
              <ul className="flex gap-6 text-sm text-text-muted">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-text">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              <span>{profile?.mc_username ?? user?.email}</span>
              <form action={signOut}>
                <Button type="submit" variant="outline" size="md">
                  Esci
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </>
  );
}
