import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getPublicSiteSettings } from "@/lib/site-content";
import { IpCopyButton } from "./IpCopyButton";
import { SiteNav } from "./SiteNav";

export async function SiteHeader() {
  const [settings, user] = await Promise.all([getPublicSiteSettings(), getCurrentUser()]);

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-border bg-bg-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-title text-sm text-text">
          {settings.site_name}
        </Link>
        <SiteNav />
        <div className="flex items-center gap-4">
          <IpCopyButton serverIp={settings.server_ip} />
          <Link href={user ? "/account" : "/login"} className="text-sm text-accent">
            {user ? "Account" : "Accedi"}
          </Link>
        </div>
      </div>
    </header>
  );
}
