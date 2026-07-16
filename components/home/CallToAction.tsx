import { PhoneCall } from "lucide-react";

import Container from "@/components/ui/Container";

const PHONE_NUMBER = "0324228010";

export default function CallToAction() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold tracking-[-0.02em] text-green-400">
              우선생에게 물어보세요
            </p>

            <h2 className="mt-2 text-[27px] font-extrabold leading-tight tracking-[-0.045em] sm:text-[34px]">
              가장 좋은 조건을
              <br className="sm:hidden" /> 쉽고 정확하게 안내합니다.
            </h2>
          </div>

          <a
            href={`tel:${PHONE_NUMBER}`}
            className="mt-6 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-green-600 px-7 text-[15px] font-bold tracking-[-0.025em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/30 lg:mt-0"
          >
            <PhoneCall
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              strokeWidth={2.3}
            />

            우선생 물어보기
          </a>
        </div>
      </Container>
    </section>
  );
}