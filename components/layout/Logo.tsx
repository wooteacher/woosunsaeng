import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="우선생 홈페이지"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-green-600 text-xl font-black tracking-[-0.08em] text-white transition-transform duration-200 group-hover:scale-[1.03]"
      >
        W
      </span>

      <span className="whitespace-nowrap text-[22px] font-extrabold tracking-[-0.05em] text-slate-950">
        우선생
      </span>
    </Link>
  );
}