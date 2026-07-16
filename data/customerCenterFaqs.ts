export type CustomerCenterCategory =
  | "전체"
  | "인터넷"
  | "렌탈"
  | "지원금"
  | "설치"
  | "결제"
  | "명의변경"
  | "이전설치"
  | "AS";

export type CustomerCenterFaq = {
  id: string;
  category: Exclude<CustomerCenterCategory, "전체">;
  question: string;
  answer: string;
};

export const customerCenterCategories: CustomerCenterCategory[] = [
  "전체",
  "인터넷",
  "렌탈",
  "지원금",
  "설치",
  "결제",
  "명의변경",
  "이전설치",
  "AS",
];

export const customerCenterFaqs: CustomerCenterFaq[] = [
  {
    id: "internet-01",
    category: "인터넷",
    question: "인터넷 가입은 어떤 순서로 진행되나요?",
    answer:
      "상품 선택 후 상담 접수 또는 간편 가입 신청을 진행하면 담당 상담사가 조건을 최종 확인합니다. 이후 통신사 가입 접수와 설치 일정 안내가 순서대로 진행됩니다.",
  },
  {
    id: "internet-02",
    category: "인터넷",
    question: "휴대폰 결합 할인도 함께 적용할 수 있나요?",
    answer:
      "가능합니다. 사용 중인 휴대폰 통신사와 회선 조건에 따라 결합 가능 여부와 할인 금액이 달라질 수 있어 상담 과정에서 정확하게 확인해드립니다.",
  },
  {
    id: "internet-03",
    category: "인터넷",
    question: "기존 인터넷은 언제 해지해야 하나요?",
    answer:
      "새 인터넷 설치가 완료된 뒤 기존 인터넷을 해지하는 것을 권장드립니다. 먼저 해지하면 설치 전까지 인터넷을 사용할 수 없는 기간이 생길 수 있습니다.",
  },
  {
    id: "rental-01",
    category: "렌탈",
    question: "렌탈 상담은 어떻게 진행되나요?",
    answer:
      "원하는 카테고리와 제품을 선택해 상담을 신청하면 제품별 월 렌탈료, 약정기간, 관리방식, 제휴카드 할인과 최신 프로모션을 안내드립니다.",
  },
  {
    id: "rental-02",
    category: "렌탈",
    question: "렌탈 제품은 신용조회가 필요한가요?",
    answer:
      "렌탈사 정책에 따라 본인 확인과 계약 심사가 진행될 수 있습니다. 심사 기준과 필요한 정보는 제품과 렌탈사에 따라 다를 수 있습니다.",
  },
  {
    id: "benefit-01",
    category: "지원금",
    question: "지원금은 언제 지급되나요?",
    answer:
      "설치 완료와 정상 개통이 확인된 후 등록하신 지급 계좌로 당일 지급하는 것을 원칙으로 안내드립니다. 정확한 지급 조건은 상담 시 최종 확인됩니다.",
  },
  {
    id: "benefit-02",
    category: "지원금",
    question: "추가 혜택도 받을 수 있나요?",
    answer:
      "기본 혜택 외 추가 프로모션은 가입 조건과 시점에 따라 달라질 수 있습니다. 가능한 추가 혜택은 담당 상담사가 전화로 안내드립니다.",
  },
  {
    id: "install-01",
    category: "설치",
    question: "설치 일정은 언제 정해지나요?",
    answer:
      "가입 접수 후 통신사 또는 설치 담당자가 연락드려 가능한 일정과 시간을 안내합니다. 셀프가입 단계에서는 별도 설치일을 입력하지 않아도 됩니다.",
  },
  {
    id: "install-02",
    category: "설치",
    question: "주말에도 설치할 수 있나요?",
    answer:
      "지역과 통신사 설치 기사 일정에 따라 주말 설치가 가능할 수 있습니다. 다만 주말·공휴일 설치비가 다르게 적용될 수 있어 상담 시 확인이 필요합니다.",
  },
  {
    id: "payment-01",
    category: "결제",
    question: "요금 납부는 어떤 방식이 가능한가요?",
    answer:
      "계좌 자동이체 또는 신용카드 자동결제를 선택할 수 있습니다. 가입 진행 시 납부자 정보와 결제수단 정보를 확인합니다.",
  },
  {
    id: "payment-02",
    category: "결제",
    question: "제휴카드 할인은 자동으로 적용되나요?",
    answer:
      "제휴카드 발급과 전월 실적 조건을 충족해야 할인이 적용됩니다. 카드사와 상품별 조건이 다르므로 상담 과정에서 정확하게 안내드립니다.",
  },
  {
    id: "name-01",
    category: "명의변경",
    question: "가입 후 명의변경이 가능한가요?",
    answer:
      "통신사 정책과 가족관계, 필요 서류에 따라 명의변경이 가능할 수 있습니다. 가입 후 명의변경은 해당 통신사 고객센터를 통해 진행하는 경우가 일반적입니다.",
  },
  {
    id: "move-01",
    category: "이전설치",
    question: "이사할 때 이전 설치는 어떻게 하나요?",
    answer:
      "현재 이용 중인 통신사 고객센터에 이전 설치를 신청하면 됩니다. 이전 지역의 설치 가능 여부와 이전 설치비를 함께 확인해야 합니다.",
  },
  {
    id: "as-01",
    category: "AS",
    question: "인터넷이나 렌탈 제품에 문제가 생기면 어디로 연락하나요?",
    answer:
      "인터넷 장애는 가입 통신사 고객센터, 렌탈 제품 점검은 해당 렌탈사 고객센터를 통해 접수합니다. 필요하면 우선생 상담을 통해 연결 방법을 안내받을 수 있습니다.",
  },
];
