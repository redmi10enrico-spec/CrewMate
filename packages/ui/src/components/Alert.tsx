import type { HTMLAttributes, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";

export type AlertTone = "danger" | "success" | "warning" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  children: ReactNode;
}

const TONE_CLASSES: Record<AlertTone, string> = {
  danger: "border-danger/30 bg-danger-muted text-danger",
  success: "border-success/30 bg-success-muted text-success",
  warning: "border-warning/30 bg-warning-muted text-warning",
  info: "border-accent/30 bg-accent-muted text-accent",
};

const TONE_ICONS: Record<AlertTone, LucideIcon> = {
  danger: AlertTriangle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

export function Alert({ tone = "info", children, className = "", ...rest }: AlertProps) {
  const Icon = TONE_ICONS[tone];
  const classes = [
    "flex items-start gap-2.5 rounded-sm border px-3.5 py-3 text-sm",
    TONE_CLASSES[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="alert" className={classes} {...rest}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
