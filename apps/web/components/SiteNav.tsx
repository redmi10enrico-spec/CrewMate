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
    <ul className="flex flex-wrap items-center gap-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={[
                "rounded-sm px-3 py-2 font-medium transition-colors duration-150",
                active ? "bg-surface-alt text-text" : "text-text-muted hover:text-text",
              ].join(" ")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
