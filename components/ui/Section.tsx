import { ReactNode } from "react";

export default function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-24 sm:py-28 ${className}`}>
      {children}
    </section>
  );
}