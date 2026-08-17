import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "accent" | "success" | "warning" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  accent: "bg-accent-muted text-accent",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
  neutral: "bg-surface-alt text-text-muted",
};

export function Badge({ tone = "neutral", icon, children, className = "", ...rest }: BadgeProps) {
  const classes = [
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium [&_svg]:size-3.5",
    TONE_CLASSES[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {icon}
      {children}
    </span>
  );
}
