import type { HTMLAttributes, ReactNode } from "react";

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  subtitle?: ReactNode;
  children: ReactNode;
}

export function SectionTitle({ subtitle, children, className = "", ...rest }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center">
      <h2
        className={["text-2xl font-semibold tracking-tight text-text", className].filter(Boolean).join(" ")}
        {...rest}
      >
        {children}
      </h2>
      {subtitle ? <p className="mx-auto mt-3 max-w-xl text-text-muted">{subtitle}</p> : null}
    </div>
  );
}
