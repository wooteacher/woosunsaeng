type Props = {
  className?: string;
};

export default function LogoIcon({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="16"
        fill="#16A34A"
      />

      <path
        d="M18 18L26 46L32 28L38 46L46 18"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}