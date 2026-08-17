import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid = false, className = "", rows = 3, ...rest }: TextareaProps) {
  const classes = [
    "w-full resize-y rounded-sm border bg-surface-alt px-3.5 py-2.5 text-sm text-text placeholder:text-text-dim transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-accent/50",
    "disabled:pointer-events-none disabled:opacity-50",
    invalid ? "border-danger focus:ring-danger/40" : "border-border hover:border-border-hover focus:border-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <textarea className={classes} rows={rows} aria-invalid={invalid || undefined} {...rest} />;
}
