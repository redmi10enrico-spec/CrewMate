import type { HTMLAttributes, ReactNode } from "react";

export interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  subtitle?: ReactNode;
  children: ReactNode;
}

export function SectionTitle({ subtitle, children, className = "", ...rest }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center">
      <h2 className={["font-title text-xl text-text", className].filter(Boolean).join(" ")} {...rest}>
        {children}
      </h2>
      {subtitle ? <p className="mt-3 text-text-muted">{subtitle}</p> : null}
    </div>
  );
}
