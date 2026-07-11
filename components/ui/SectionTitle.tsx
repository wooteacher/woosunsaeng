type Props = {
  badge: string;
  title: string;
  description: string;
  center?: boolean;
};

export default function SectionTitle({
  badge,
  title,
  description,
  center = true,
}: Props) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : ""}>
      <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
        {badge}
      </span>

      <h2 className="mt-5 text-4xl font-black tracking-tight text-gray-950 md:text-5xl">
        {title}
      </h2>

      <p className="mt-5 text-lg font-semibold leading-8 text-gray-600">
        {description}
      </p>
    </div>
  );
}