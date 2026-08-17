import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid = false, className = "", ...rest }: InputProps) {
  const classes = [
    "h-11 w-full rounded-sm border bg-surface-alt px-3.5 text-sm text-text placeholder:text-text-dim transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-accent/50",
    "disabled:pointer-events-none disabled:opacity-50",
    invalid ? "border-danger focus:ring-danger/40" : "border-border hover:border-border-hover focus:border-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} aria-invalid={invalid || undefined} {...rest} />;
}
