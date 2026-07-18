type SectionTitleProps = {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
};

export default function SectionTitle({
  badge,
  title,
  description,
  center = true,
}: SectionTitleProps) {
  return (
    <div className={["max-w-3xl", center ? "mx-auto text-center" : ""].join(" ")}>
      {badge && (
        <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-extrabold text-green-700">
          {badge}
        </span>
      )}

      <h2
        className={[
          badge ? "mt-5" : "",
          "break-keep text-3xl font-black leading-[1.15] tracking-[-0.045em] text-slate-950",
          "sm:text-4xl lg:text-[46px]",
        ].join(" ")}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-4 break-keep text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}
