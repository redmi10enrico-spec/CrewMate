import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title?: ReactNode;
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ icon, title, interactive = false, children, className = "", ...rest }: CardProps) {
  const classes = [
    "rounded-lg border border-border bg-surface p-6 text-sm text-text-muted shadow-sm transition-all duration-200",
    interactive ? "hover:-translate-y-0.5 hover:border-border-hover hover:shadow cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {icon ? (
        <div className="mb-4 flex size-10 items-center justify-center rounded-sm bg-accent-muted text-accent [&_svg]:size-5">
          {icon}
        </div>
      ) : null}
      {title ? <h3 className="mb-1.5 text-base font-semibold text-text">{title}</h3> : null}
      {children}
    </div>
  );
}
