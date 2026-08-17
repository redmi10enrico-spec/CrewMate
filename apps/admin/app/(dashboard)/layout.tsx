import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@crewmate/ui";
import { getProfile } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const NAV_ITEMS = [{ href: "/", label: "Dashboard", icon: LayoutDashboard }];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex size-8 items-center justify-center rounded-sm bg-accent-muted text-accent">
            <ShieldCheck className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-text">CrewMate Admin</span>
        </div>

        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-sm bg-surface-alt px-3 py-2.5 text-sm font-medium text-text transition-colors duration-150 hover:bg-surface-hover"
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate text-sm text-text-muted">{profile?.mc_username ?? user?.email}</p>
          <form action={signOut} className="mt-3">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start px-2"
              icon={<LogOut className="size-4" aria-hidden />}
            >
              Esci
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
