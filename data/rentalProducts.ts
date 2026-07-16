export type RentalCategory =
  | "정수기"
  | "공기청정기"
  | "비데"
  | "안마의자"
  | "매트리스"
  | "TV"
  | "냉장고"
  | "세탁기"
  | "건조기";

export type RentalProduct = {
  id: string;
  category: RentalCategory;
  brand: string;
  name: string;
  description: string;
  monthlyPrice: number;
  cardDiscount: number;
  contractMonths: number;
  maintenance: string;
  recommended?: boolean;
  badge?: string;
};

export const rentalCategories: RentalCategory[] = [
  "정수기",
  "공기청정기",
  "비데",
  "안마의자",
  "매트리스",
  "TV",
  "냉장고",
  "세탁기",
  "건조기",
];

/**
 * 초기 UI 확인용 예시 데이터입니다.
 * 실제 운영 전 제휴사 최신 렌탈료·약정·관리조건으로 교체하세요.
 */
export const rentalProducts: RentalProduct[] = [
  {
    id: "water-coway-001",
    category: "정수기",
    brand: "코웨이",
    name: "아이콘형 직수 정수기",
    description: "슬림한 크기와 간편한 관리가 필요한 가정용 정수기",
    monthlyPrice: 31900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "방문관리",
    recommended: true,
    badge: "인기",
  },
  {
    id: "water-cuckoo-001",
    category: "정수기",
    brand: "쿠쿠",
    name: "제로백 직수 정수기",
    description: "냉수와 정수를 빠르게 사용할 수 있는 실속형 제품",
    monthlyPrice: 28900,
    cardDiscount: 17000,
    contractMonths: 60,
    maintenance: "셀프관리",
  },
  {
    id: "water-skmagic-001",
    category: "정수기",
    brand: "SK매직",
    name: "초소형 직수 정수기",
    description: "좁은 공간에도 부담 없이 설치할 수 있는 미니멀 제품",
    monthlyPrice: 29900,
    cardDiscount: 18000,
    contractMonths: 60,
    maintenance: "방문관리",
  },
  {
    id: "air-coway-001",
    category: "공기청정기",
    brand: "코웨이",
    name: "멀티액션 공기청정기",
    description: "거실과 넓은 공간에 적합한 고성능 공기청정기",
    monthlyPrice: 35900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "방문관리",
    recommended: true,
  },
  {
    id: "air-samsung-001",
    category: "공기청정기",
    brand: "삼성",
    name: "비스포크 큐브 공기청정기",
    description: "인테리어와 공기 관리를 함께 고려한 프리미엄 제품",
    monthlyPrice: 42900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "셀프관리",
  },
  {
    id: "bidet-coway-001",
    category: "비데",
    brand: "코웨이",
    name: "스타일케어 비데",
    description: "위생 관리와 편안한 사용성을 갖춘 가정용 비데",
    monthlyPrice: 22900,
    cardDiscount: 15000,
    contractMonths: 60,
    maintenance: "방문관리",
  },
  {
    id: "massage-ceragem-001",
    category: "안마의자",
    brand: "세라젬",
    name: "웰카페 안마의자",
    description: "온 가족이 편안하게 사용할 수 있는 휴식형 안마의자",
    monthlyPrice: 89900,
    cardDiscount: 25000,
    contractMonths: 60,
    maintenance: "정기점검",
    recommended: true,
    badge: "프리미엄",
  },
  {
    id: "mattress-coway-001",
    category: "매트리스",
    brand: "코웨이",
    name: "슬립케어 매트리스",
    description: "정기적인 위생 관리가 포함된 렌탈 매트리스",
    monthlyPrice: 49900,
    cardDiscount: 20000,
    contractMonths: 72,
    maintenance: "방문관리",
  },
  {
    id: "tv-samsung-001",
    category: "TV",
    brand: "삼성",
    name: "UHD 스마트 TV",
    description: "거실용으로 적합한 대화면 스마트 TV",
    monthlyPrice: 45900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "무상보증",
  },
  {
    id: "fridge-lg-001",
    category: "냉장고",
    brand: "LG",
    name: "오브제컬렉션 냉장고",
    description: "넉넉한 수납과 미니멀한 디자인을 갖춘 냉장고",
    monthlyPrice: 72900,
    cardDiscount: 25000,
    contractMonths: 60,
    maintenance: "무상보증",
  },
  {
    id: "washer-lg-001",
    category: "세탁기",
    brand: "LG",
    name: "트롬 세탁기",
    description: "대용량 세탁과 편리한 스마트 기능을 갖춘 제품",
    monthlyPrice: 55900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "무상보증",
  },
  {
    id: "dryer-samsung-001",
    category: "건조기",
    brand: "삼성",
    name: "비스포크 그랑데 건조기",
    description: "의류 손상을 줄이고 편리하게 건조할 수 있는 제품",
    monthlyPrice: 57900,
    cardDiscount: 20000,
    contractMonths: 60,
    maintenance: "무상보증",
  },
];

export function getRentalBrands(category: RentalCategory) {
  return Array.from(
    new Set(
      rentalProducts
        .filter((product) => product.category === category)
        .map((product) => product.brand),
    ),
  );
}
