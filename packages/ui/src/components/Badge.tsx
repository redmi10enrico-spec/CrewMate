import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "green" | "danger" | "warning";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  green: "bg-green/15 text-green",
  danger: "bg-danger/15 text-danger",
  warning: "bg-warning/15 text-warning",
};

export function Badge({ tone = "green", children, className = "", ...rest }: BadgeProps) {
  const classes = [
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
    TONE_CLASSES[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
