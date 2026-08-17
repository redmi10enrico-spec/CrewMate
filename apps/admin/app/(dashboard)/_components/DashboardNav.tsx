"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, LayoutDashboard, Palette, Sparkles, type LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/branding", label: "Aspetto & Branding", icon: Palette },
  { href: "/modalita-server", label: "Modalità di gioco", icon: Gamepad2 },
  { href: "/home-features", label: "Perché sceglierci", icon: Sparkles },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                  active ? "bg-surface-alt text-text" : "text-text-muted hover:bg-surface-hover hover:text-text",
                ].join(" ")}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
