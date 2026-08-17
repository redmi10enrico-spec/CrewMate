import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getPublicSiteSettings } from "@/lib/site-content";
import { CartLink } from "./CartLink";
import { IpCopyButton } from "./IpCopyButton";
import { Logo } from "./Logo";
import { SiteNav } from "./SiteNav";

export async function SiteHeader() {
  const [settings, user] = await Promise.all([getPublicSiteSettings(), getCurrentUser()]);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-bg-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/">
          <Logo siteName={settings.site_name} />
        </Link>
        <SiteNav />
        <div className="flex items-center gap-3">
          <IpCopyButton serverIp={settings.server_ip} className="hidden sm:inline-flex" />
          <CartLink />
          <Link
            href={user ? "/account" : "/login"}
            className="inline-flex h-10 items-center gap-1.5 rounded-sm bg-accent px-4 text-sm font-medium text-bg-950 transition-colors duration-150 hover:bg-accent-hover"
          >
            {user ? "Account" : "Accedi"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
