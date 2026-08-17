import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// Header/Footer leggono site_settings dal DB: senza revalidate resterebbero
// statici al contenuto del build e le modifiche dal pannello admin non si
// vedrebbero mai sul sito pubblico.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "CrewMate Network — Server Minecraft",
  description:
    "CrewMate Network: il server Minecraft dove costruire, giocare e crescere insieme alla community.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="flex min-h-screen flex-col bg-bg-950 font-sans text-text antialiased">
        <SiteHeader />
        <main className="flex-1 pt-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
