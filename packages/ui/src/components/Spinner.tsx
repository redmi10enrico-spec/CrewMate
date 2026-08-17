import { Loader2 } from "lucide-react";

export interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className = "", label = "Caricamento in corso" }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <Loader2 className={["size-5 animate-spin text-accent", className].filter(Boolean).join(" ")} />
    </span>
  );
}
