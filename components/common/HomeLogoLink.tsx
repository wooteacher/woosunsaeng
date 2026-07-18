import BrandLogo from "@/components/common/BrandLogo";

type HomeLogoLinkProps = {
  className?: string;
};

export default function HomeLogoLink({
  className = "",
}: HomeLogoLinkProps) {
  return <BrandLogo className={className} />;
}
