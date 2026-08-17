import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...rest }: SelectProps) {
  const classes = [
    "h-11 w-full appearance-none rounded-sm border border-border bg-surface-alt px-3.5 pr-9 text-sm text-text transition-colors duration-150",
    "hover:border-border-hover focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative">
      <select className={classes} {...rest}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-dim"
        aria-hidden
      />
    </div>
  );
}
