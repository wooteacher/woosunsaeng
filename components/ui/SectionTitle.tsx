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
    <div
      className={[
        "max-w-3xl",
        center ? "mx-auto text-center" : "",
      ].join(" ")}
    >

      {badge && (
        <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
          {badge}
        </span>
      )}


      <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>


      {description && (
        <p className="mt-4 text-base font-semibold leading-7 text-gray-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}

    </div>
  );
}