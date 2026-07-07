import { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
      {children}
    </span>
  );
}