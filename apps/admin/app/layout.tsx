import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrewMate Network — Admin",
  description: "Pannello di amministrazione CrewMate Network.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-bg-900 font-body text-text">{children}</body>
    </html>
  );
}
