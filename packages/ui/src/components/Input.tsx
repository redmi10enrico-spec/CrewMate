import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...rest }: InputProps) {
  const classes = [
    "w-full rounded border border-border bg-surface-alt px-3 py-2 text-text placeholder:text-text-dim focus:border-accent focus:outline-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} {...rest} />;
}
