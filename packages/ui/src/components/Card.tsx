import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
}

export function Card({ icon, title, children, className = "", ...rest }: CardProps) {
  const classes = ["rounded-lg border border-accent-soft bg-surface p-6 shadow", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {icon ? <div className="mb-3 text-3xl">{icon}</div> : null}
      {title ? <h3 className="mb-2 font-title text-text">{title}</h3> : null}
      {children}
    </div>
  );
}
