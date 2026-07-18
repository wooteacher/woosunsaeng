import type { Metadata } from "next";

import "./globals.css";

import { CalculatorProvider } from "@/contexts/CalculatorContext";

export const metadata: Metadata = {
  title: "우선생 | 인터넷 · TV · 렌탈 생활서비스",
  description:
    "인터넷, 인터넷+TV, 생활 렌탈 상담을 쉽고 빠르게 안내하는 우선생입니다. 맞춤 조건 비교부터 설치 안내까지 도와드립니다.",
  keywords: [
    "우선생",
    "인터넷 가입",
    "인터넷 TV",
    "렌탈",
    "생활서비스",
    "인터넷 상담",
  ],
  authors: [{ name: "우선생" }],
  openGraph: {
    title: "우선생 | 우리가 선택한 생활서비스",
    description: "인터넷과 렌탈, 복잡한 비교 없이 우선생이 쉽게 안내합니다.",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full">
        <CalculatorProvider>{children}</CalculatorProvider>
      </body>
    </html>
  );
}
