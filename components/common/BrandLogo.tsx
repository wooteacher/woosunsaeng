import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  priority = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="우선생 홈으로 이동"
      className={`inline-flex shrink-0 items-center gap-2 ${className}`}
    >
      <span className="relative block h-[25px] w-[70px] shrink-0 sm:h-[28px] sm:w-[79px]">
        <Image
          src="/images/logo/woosunsaeng-logo.svg"
          alt=""
          fill
          sizes="(max-width: 639px) 70px, 79px"
          priority={priority}
          className="object-contain object-left"
        />
      </span>

      <span className="whitespace-nowrap text-[21px] font-black leading-none tracking-[-0.05em] text-green-700 sm:text-[23px]">
        우선생
      </span>
    </Link>
  );
}
