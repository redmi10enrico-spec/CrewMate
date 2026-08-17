import type { ButtonHTMLAttributes } from "react";

export interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  label: string;
}

export function Switch({ checked, label, className = "", ...rest }: SwitchProps) {
  const classes = [
    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-950",
    checked ? "bg-accent" : "border border-border bg-surface-alt",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="submit" role="switch" aria-checked={checked} aria-label={label} className={classes} {...rest}>
      <span
        className={[
          "inline-block size-4 transform rounded-full bg-white transition-transform duration-150",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
