import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-content";
import { Logo } from "./Logo";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-900">
      <div className="mx-auto max-w-site px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo siteName={settings.site_name} />
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              Il server Minecraft dove costruire, giocare e crescere insieme alla community.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-dim">Naviga</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-text">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-text">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/forum" className="transition-colors hover:text-text">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/candidature" className="transition-colors hover:text-text">
                  Candidature
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-dim">Community</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              <li>
                <a href={settings.discord_url} className="transition-colors hover:text-text">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Regolamento
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Staff
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Vote
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-dim">Legale</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-muted">
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Termini di Servizio
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-text">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 text-sm text-text-dim sm:flex-row sm:justify-between">
          <span>
            © {year} {settings.site_name}. Non affiliato con Mojang o Microsoft.
          </span>
          <span>Realizzato dalla community</span>
        </div>
      </div>
    </footer>
  );
}
