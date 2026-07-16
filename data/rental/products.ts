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

export type RentalSort = "추천순" | "낮은가격순" | "높은가격순" | "최신순";

export type RentalProduct = {
  id: string;
  category: RentalCategory;
  brand: string;
  name: string;
  modelName: string;
  image: string;
  sourceUrl: string;
  monthlyPrice: number;
  cardDiscount: number;
  contractMonths: number;
  managementType: string;
  stockStatus: "재고있음" | "상담필요" | "품절";
  recommended?: boolean;
  popular?: boolean;
  isNew?: boolean;
  features: string[];
  createdOrder: number;
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
 * 상품명·모델·가격은 제휴사 공개 상품 구조를 참고한 초기 데이터입니다.
 * 실제 운영 전 제휴사 관리자 화면의 최신 가격·옵션으로 최종 확인하세요.
 *
 * 이미지 사용 방법:
 * public/images/rental/products/ 안에 동일한 파일명으로 이미지를 넣으면
 * 카드가 자동으로 실제 상품 이미지로 표시됩니다.
 */
export const rentalProducts: RentalProduct[] = [
  {
    id: "cuckoo-cp-aqs100ewh",
    category: "정수기",
    brand: "쿠쿠",
    name: "제로 100 미니 얼음 냉온정수기",
    modelName: "CP-AQS100EWH",
    image: "/images/rental/products/cp-aqs100ewh.webp",
    sourceUrl: "https://vip-rental.com/categ/1091",
    monthlyPrice: 51900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "재고있음",
    recommended: true,
    popular: true,
    isNew: true,
    features: ["얼음", "냉온정", "미니사이즈"],
    createdOrder: 100,
  },
  {
    id: "cuckoo-cp-ss100wsv",
    category: "정수기",
    brand: "쿠쿠",
    name: "ZERO 100S 끓인물 얼음냉온정수기",
    modelName: "CP-SS100WSV",
    image: "/images/rental/products/cp-ss100wsv.webp",
    sourceUrl: "https://vip-rental.com/categ/1091",
    monthlyPrice: 50900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "재고있음",
    recommended: true,
    popular: true,
    features: ["100℃ 끓인물", "얼음", "냉온정"],
    createdOrder: 95,
  },
  {
    id: "coway-ap-1125g",
    category: "공기청정기",
    brand: "코웨이",
    name: "스퀘어핏 공기청정기 38㎡",
    modelName: "AP-1125G",
    image: "/images/rental/products/ap-1125g.webp",
    sourceUrl: "https://vip-rental.com/categ/1059",
    monthlyPrice: 23900,
    cardDiscount: 15000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "재고있음",
    recommended: true,
    popular: true,
    features: ["38㎡", "슬림디자인", "자동공기질"],
    createdOrder: 90,
  },
  {
    id: "lg-as305dwwam",
    category: "공기청정기",
    brand: "LG 퓨리케어",
    name: "360˚ 공기청정기 플러스 + 무빙휠",
    modelName: "AS305DWWAM",
    image: "/images/rental/products/as305dwwam.webp",
    sourceUrl: "https://vip-rental.com/categ/1081",
    monthlyPrice: 50900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "자가관리",
    stockStatus: "재고있음",
    popular: true,
    features: ["360˚ 청정", "무빙휠", "대형공간"],
    createdOrder: 85,
  },
  {
    id: "chungho-ap-25h8150",
    category: "공기청정기",
    brand: "청호나이스",
    name: "서밋 타워 공기청정기 25평형",
    modelName: "AP-25H8150",
    image: "/images/rental/products/ap-25h8150.webp",
    sourceUrl: "https://vip-rental.com/categ/1087",
    monthlyPrice: 43900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "재고있음",
    features: ["25평형", "타워형", "대형필터"],
    createdOrder: 80,
  },
  {
    id: "chungho-ap-15h5174",
    category: "공기청정기",
    brand: "청호나이스",
    name: "디오 항균 공기청정기 19평형",
    modelName: "AP-15H5174",
    image: "/images/rental/products/ap-15h5174.webp",
    sourceUrl: "https://vip-rental.com/categ/1087",
    monthlyPrice: 30900,
    cardDiscount: 15000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "재고있음",
    features: ["19평형", "항균필터", "저소음"],
    createdOrder: 75,
  },
  {
    id: "cuckoo-ac-30ah30fedg",
    category: "공기청정기",
    brand: "쿠쿠",
    name: "인스퓨어 헤리티지 공기청정기",
    modelName: "AC-30AH30FEDG",
    image: "/images/rental/products/ac-30ah30fedg.webp",
    sourceUrl: "https://vip-rental.com/categ/1092",
    monthlyPrice: 37900,
    cardDiscount: 17000,
    contractMonths: 60,
    managementType: "자가관리",
    stockStatus: "재고있음",
    isNew: true,
    features: ["대형청정", "헤리티지 디자인", "미세먼지"],
    createdOrder: 110,
  },
  {
    id: "cuckoo-ac-28ah10fnw",
    category: "공기청정기",
    brand: "쿠쿠",
    name: "인스퓨어 공기청정기 10% 프로모션",
    modelName: "AC-28AH10FNW",
    image: "/images/rental/products/ac-28ah10fnw.webp",
    sourceUrl: "https://vip-rental.com/categ/1092",
    monthlyPrice: 33210,
    cardDiscount: 17000,
    contractMonths: 60,
    managementType: "자가관리",
    stockStatus: "재고있음",
    popular: true,
    features: ["프로모션", "대형필터", "자동청정"],
    createdOrder: 105,
  },
  {
    id: "skmagic-bidet-basic",
    category: "비데",
    brand: "SK매직",
    name: "올클린 생활방수 비데",
    modelName: "BIDET-SK-01",
    image: "/images/rental/products/bidet-sk-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 22900,
    cardDiscount: 15000,
    contractMonths: 60,
    managementType: "방문관리",
    stockStatus: "상담필요",
    recommended: true,
    features: ["생활방수", "노즐세척", "온열시트"],
    createdOrder: 70,
  },
  {
    id: "cuckoo-massage-basic",
    category: "안마의자",
    brand: "쿠쿠",
    name: "프리미엄 전신 안마의자",
    modelName: "MASSAGE-CK-01",
    image: "/images/rental/products/massage-ck-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 89900,
    cardDiscount: 25000,
    contractMonths: 60,
    managementType: "정기점검",
    stockStatus: "상담필요",
    recommended: true,
    features: ["전신안마", "온열", "무중력모드"],
    createdOrder: 60,
  },
  {
    id: "coway-mattress-basic",
    category: "매트리스",
    brand: "코웨이",
    name: "슬립케어 프리미엄 매트리스",
    modelName: "MATTRESS-CW-01",
    image: "/images/rental/products/mattress-cw-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 49900,
    cardDiscount: 20000,
    contractMonths: 72,
    managementType: "방문관리",
    stockStatus: "상담필요",
    features: ["위생관리", "케어키트", "프리미엄폼"],
    createdOrder: 55,
  },
  {
    id: "lg-tv-basic",
    category: "TV",
    brand: "LG전자",
    name: "UHD 스마트 TV",
    modelName: "TV-LG-01",
    image: "/images/rental/products/tv-lg-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 45900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "무상보증",
    stockStatus: "상담필요",
    features: ["UHD", "스마트TV", "대화면"],
    createdOrder: 50,
  },
  {
    id: "lg-fridge-basic",
    category: "냉장고",
    brand: "LG전자",
    name: "오브제컬렉션 4도어 냉장고",
    modelName: "FRIDGE-LG-01",
    image: "/images/rental/products/fridge-lg-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 72900,
    cardDiscount: 25000,
    contractMonths: 60,
    managementType: "무상보증",
    stockStatus: "상담필요",
    features: ["4도어", "대용량", "오브제"],
    createdOrder: 45,
  },
  {
    id: "lg-washer-basic",
    category: "세탁기",
    brand: "LG전자",
    name: "트롬 대용량 세탁기",
    modelName: "WASHER-LG-01",
    image: "/images/rental/products/washer-lg-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 55900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "무상보증",
    stockStatus: "상담필요",
    features: ["대용량", "AI세탁", "스마트연결"],
    createdOrder: 40,
  },
  {
    id: "samsung-dryer-basic",
    category: "건조기",
    brand: "삼성전자",
    name: "비스포크 그랑데 건조기",
    modelName: "DRYER-SS-01",
    image: "/images/rental/products/dryer-ss-01.webp",
    sourceUrl: "https://vip-rental.com/",
    monthlyPrice: 57900,
    cardDiscount: 20000,
    contractMonths: 60,
    managementType: "무상보증",
    stockStatus: "상담필요",
    features: ["AI건조", "대용량", "비스포크"],
    createdOrder: 35,
  },
];

export function getBrands(category: RentalCategory) {
  return Array.from(
    new Set(
      rentalProducts
        .filter((product) => product.category === category)
        .map((product) => product.brand),
    ),
  );
}
