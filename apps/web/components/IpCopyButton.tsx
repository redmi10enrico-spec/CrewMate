"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function IpCopyButton({ serverIp, className = "" }: { serverIp: string; className?: string }) {
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
      title="Clicca per copiare l'IP"
      className={[
        "inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-surface-alt px-3.5 font-mono text-sm text-text transition-colors duration-150 hover:border-border-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-950",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {copied ? (
        <>
          <Check className="size-4 text-success" aria-hidden />
          Copiato
        </>
      ) : (
        <>
          <Copy className="size-4 text-text-dim" aria-hidden />
          {serverIp}
        </>
      )}
    </button>
  );
}
