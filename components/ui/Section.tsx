import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export default function Section({
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      className={[
        "py-14",
        "sm:py-18",
        "lg:py-22",
        "xl:py-24",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}