export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-black mb-8">
        개인정보처리방침
      </h1>

      <div className="space-y-8 leading-8 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold mb-3">
            1. 수집하는 개인정보
          </h2>

          <p>
            우선생은 상담 신청을 위하여 아래 개인정보를 수집합니다.
          </p>

          <ul className="list-disc ml-6 mt-3">
            <li>이름</li>
            <li>연락처</li>
            <li>상담 서비스</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">
            2. 개인정보 이용목적
          </h2>

          <ul className="list-disc ml-6">
            <li>상담 진행</li>
            <li>상품 안내</li>
            <li>설치 일정 안내</li>
            <li>고객 문의 대응</li>
          </ul>
        </section>

        <section>
        <h2 className="mb-3 text-2xl font-bold">
         3. 개인정보 보유 및 이용 기간
        </h2>

        <p>
         상담 신청 정보는 상담 종료일로부터 3개월간 보관한 후
         지체 없이 파기합니다. 다만, 계약이 체결되었거나 관련 법령에
            따라 보존할 의무가 있는 경우에는 해당 법령에서 정한 기간 동안
            보관할 수 있습니다.
        </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">
            4. 개인정보 보호
          </h2>

          <p>
            개인정보는 암호화된 통신(HTTPS)을 통해 전송되며,
            접근 권한이 있는 관리자만 열람할 수 있습니다.
          </p>
        </section>

      </div>
    </main>
  );
}