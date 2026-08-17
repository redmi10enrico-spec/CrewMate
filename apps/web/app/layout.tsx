import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrewMate Network — Server Minecraft",
  description:
    "CrewMate Network: il server Minecraft dove costruire, giocare e crescere insieme alla community.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="flex min-h-screen flex-col bg-bg-900 font-body text-text">
        <SiteHeader />
        <main className="flex-1 pt-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
