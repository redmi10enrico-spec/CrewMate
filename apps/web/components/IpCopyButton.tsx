"use client";

import { useState } from "react";

export function IpCopyButton({ serverIp }: { serverIp: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard non disponibile (es. contesto non sicuro): nessun feedback.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded border border-border bg-surface-alt px-3 py-1.5 text-sm text-text"
      title="Clicca per copiare l'IP"
    >
      {copied ? "✅ Copiato!" : `🎮 ${serverIp}`}
    </button>
  );
}
