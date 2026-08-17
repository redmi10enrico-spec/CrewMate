import { Boxes } from "lucide-react";

export function Logo({ siteName }: { siteName: string }) {
  return (
    <span className="flex items-center gap-2.5 text-sm font-semibold text-text">
      <span className="flex size-8 items-center justify-center rounded-sm bg-accent-muted text-accent">
        <Boxes className="size-4" aria-hidden />
      </span>
      {siteName}
    </span>
  );
}
