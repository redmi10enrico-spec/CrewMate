"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/forum", label: "Forum" },
  { href: "/candidature", label: "Candidature" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap gap-6 text-sm">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link href={item.href} className={active ? "text-accent" : "text-text-muted hover:text-text"}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
