"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Gamepad2,
  LayoutDashboard,
  ListTree,
  Package,
  Palette,
  Receipt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  { label: "Generale", items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Sito pubblico",
    items: [
      { href: "/branding", label: "Aspetto & Branding", icon: Palette },
      { href: "/modalita-server", label: "Modalità di gioco", icon: Gamepad2 },
      { href: "/home-features", label: "Perché sceglierci", icon: Sparkles },
    ],
  },
  {
    label: "Shop",
    items: [
      { href: "/categorie", label: "Categorie", icon: ListTree },
      { href: "/prodotti", label: "Prodotti", icon: Package },
      { href: "/ordini", label: "Ordini", icon: Receipt },
    ],
  },
  {
    label: "Candidature",
    items: [{ href: "/candidature", label: "Moduli & Revisione", icon: ClipboardList }],
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-6 px-3">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-text-dim">
            {section.label}
          </p>
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                      active
                        ? "bg-surface-alt text-text"
                        : "text-text-muted hover:bg-surface-hover hover:text-text",
                    ].join(" ")}
                  >
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
