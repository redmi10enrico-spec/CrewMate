import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-content";

export async function SiteFooter() {
  const settings = await getPublicSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-800">
      <div className="mx-auto max-w-site px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-title text-sm text-text">{settings.site_name}</p>
            <p className="mt-3 text-sm text-text-muted">
              Il server Minecraft dove costruire, giocare e crescere insieme alla community.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm text-text">Naviga</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/forum">Forum</Link>
              </li>
              <li>
                <Link href="/candidature">Candidature</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm text-text">Community</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <a href={settings.discord_url}>Discord</a>
              </li>
              <li>
                <a href="#">Regolamento</a>
              </li>
              <li>
                <a href="#">Staff</a>
              </li>
              <li>
                <a href="#">Vote</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm text-text">Legale</h4>
            <ul className="flex flex-col gap-2 text-sm text-text-muted">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Termini di Servizio</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-text-dim sm:flex-row sm:justify-between">
          <span>
            © {year} {settings.site_name}. Non affiliato con Mojang o Microsoft.
          </span>
          <span>Fatto con 💙 dalla community</span>
        </div>
      </div>
    </footer>
  );
}
