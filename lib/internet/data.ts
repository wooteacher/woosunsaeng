export type Carrier =
  | "KT"
  | "LG U+"
  | "SK"
  | "SkyLife"
  | "HelloVision"
  | "SKB";

export type Speed = "100M" | "500M" | "1G";

export type RewardInfo = {
  amount: number;
  extraBenefit: string;
};

export type InternetPlan = {
  id: string;
  speed: Speed;
  name: string;
  description: string;
  monthlyPrice: number;
  mobileDiscount: number;
  reward: RewardInfo;
  recommended?: boolean;
};

export type TvPlan = {
  id: string;
  name: string;
  channels: number;
  description: string;
  monthlyPrice: number;
  recommended?: boolean;
};

export type BundleRule = {
  id: string;
  speed: Speed;
  tvPlanId: string;
  bundleMonthlyPrice: number;
  mobileDiscount: number;
  reward: RewardInfo;
};

export type CarrierData = {
  id: Carrier;
  label: string;
  logo: string;
  maxCardDiscount: number;
  internetPlans: InternetPlan[];
  tvPlans: TvPlan[];
  bundleRules: BundleRule[];
};

const reward = (amount: number): RewardInfo => ({
  amount,
  extraBenefit: "추가 혜택은 상담 시 안내",
});

type BundleMatrix = {
  tvPlanId: string;
  prices: Record<Speed, number>;
  mobilePrices?: Partial<Record<Speed, number>>;
  rewards: Record<Speed, number>;
};

function createBundleRules(
  carrierPrefix: string,
  rows: BundleMatrix[],
): BundleRule[] {
  return rows.flatMap((row) =>
    (["100M", "500M", "1G"] as Speed[]).map((speed) => ({
      id: `${carrierPrefix}-${speed.toLowerCase()}-${row.tvPlanId}`,
      speed,
      tvPlanId: row.tvPlanId,
      bundleMonthlyPrice: row.prices[speed],
      mobileDiscount: Math.max(
        row.prices[speed] - (row.mobilePrices?.[speed] ?? row.prices[speed]),
        0,
      ),
      reward: reward(row.rewards[speed]),
    })),
  );
}

export const carrierOrder: Carrier[] = [
  "KT",
  "LG U+",
  "SK",
  "SkyLife",
  "HelloVision",
  "SKB",
];

export const internetData: Record<Carrier, CarrierData> = {
  KT: {
    id: "KT",
    label: "KT",
    logo: "/carriers/kt.png",
    maxCardDiscount: 22000,

    internetPlans: [
      {
        id: "kt-internet-100",
        speed: "100M",
        name: "슬림",
        description: "웹서핑과 영상 시청에 적합",
        monthlyPrice: 22000,
        mobileDiscount: 3300,
        reward: reward(90000),
      },
      {
        id: "kt-internet-500",
        speed: "500M",
        name: "베이직",
        description: "여러 기기를 함께 사용하는 가정",
        monthlyPrice: 33000,
        mobileDiscount: 5500,
        reward: reward(140000),
        recommended: true,
      },
      {
        id: "kt-internet-1g",
        speed: "1G",
        name: "에센스",
        description: "대용량 전송과 고화질 방송",
        monthlyPrice: 38500,
        mobileDiscount: 5500,
        reward: reward(140000),
      },
    ],

    // 아래 TV 월요금은 3년 약정·인터넷 결합 기준 TV 이용료에
    // 기가지니A 셋톱박스 임대료 3,300원을 포함한 고객 안내 금액입니다.
    tvPlans: [
      {
        id: "kt-tv-basic",
        name: "베이직",
        channels: 238,
        description: "기가지니A 포함 · 경제적인 기본 채널",
        monthlyPrice: 14850,
        recommended: true,
      },
      {
        id: "kt-tv-light",
        name: "라이트",
        channels: 240,
        description: "기가지니A 포함 · 인기 채널을 합리적으로",
        monthlyPrice: 16500,
      },
      {
        id: "kt-tv-essence",
        name: "에센스",
        channels: 263,
        description: "기가지니A 포함 · 다양한 프리미엄 채널",
        monthlyPrice: 18700,
      },
      {
        id: "kt-tv-allg",
        name: "모든G",
        channels: 250,
        description: "기가지니A 포함 · VOD와 다양한 콘텐츠",
        monthlyPrice: 19800,
      },
      {
        id: "kt-tv-disney-allg",
        name: "디즈니+ 모든G",
        channels: 250,
        description: "기가지니A 포함 · 모든G와 디즈니+ 결합",
        monthlyPrice: 23700,
      },
    ],

    // 총액 = TV 결합 적용 인터넷 요금 + 기가지니A 포함 TV 월요금
    // 인터넷 부분: 100M 22,000원 / 500M 27,500원 / 1G 33,000원
    bundleRules: createBundleRules("kt", [
      {
        tvPlanId: "kt-tv-basic",
        prices: { "100M": 36850, "500M": 42350, "1G": 47850 },
        mobilePrices: { "100M": 33550, "500M": 36850, "1G": 42350 },
        rewards: { "100M": 370000, "500M": 450000, "1G": 450000 },
      },
      {
        tvPlanId: "kt-tv-light",
        prices: { "100M": 38500, "500M": 44000, "1G": 49500 },
        mobilePrices: { "100M": 35200, "500M": 38500, "1G": 44000 },
        rewards: { "100M": 370000, "500M": 450000, "1G": 450000 },
      },
      {
        tvPlanId: "kt-tv-essence",
        prices: { "100M": 40700, "500M": 46200, "1G": 51700 },
        mobilePrices: { "100M": 37400, "500M": 40700, "1G": 46200 },
        rewards: { "100M": 370000, "500M": 450000, "1G": 450000 },
      },
      {
        tvPlanId: "kt-tv-allg",
        prices: { "100M": 41800, "500M": 47300, "1G": 52800 },
        mobilePrices: { "100M": 38500, "500M": 41800, "1G": 47300 },
        rewards: { "100M": 370000, "500M": 450000, "1G": 450000 },
      },
      {
        tvPlanId: "kt-tv-disney-allg",
        prices: { "100M": 45700, "500M": 51200, "1G": 56700 },
        mobilePrices: { "100M": 42400, "500M": 45700, "1G": 51200 },
        rewards: { "100M": 370000, "500M": 450000, "1G": 450000 },
      },
    ]),
  },

  "LG U+": {
    id: "LG U+",
    label: "LG U+",
    logo: "/carriers/lg.png",
    maxCardDiscount: 18000,

    internetPlans: [
      {
        id: "lg-internet-100",
        speed: "100M",
        name: "광랜",
        description: "기본 인터넷 사용",
        monthlyPrice: 22000,
        mobileDiscount: 5500,
        reward: reward(200000),
      },
      {
        id: "lg-internet-500",
        speed: "500M",
        name: "기가슬림",
        description: "가족과 여러 기기 사용",
        monthlyPrice: 33000,
        mobileDiscount: 9900,
        reward: reward(230000),
        recommended: true,
      },
      {
        id: "lg-internet-1g",
        speed: "1G",
        name: "기가",
        description: "고용량 작업과 스트리밍",
        monthlyPrice: 38500,
        mobileDiscount: 13200,
        reward: reward(230000),
      },
    ],

    tvPlans: [
      {
        id: "lg-tv-value",
        name: "실속형",
        channels: 219,
        description: "실속 있는 기본 채널",
        monthlyPrice: 17600,
        recommended: true,
      },
      {
        id: "lg-tv-basic",
        name: "기본형",
        channels: 225,
        description: "인기 채널 중심",
        monthlyPrice: 18700,
      },
      {
        id: "lg-tv-premium",
        name: "프리미엄",
        channels: 253,
        description: "프리미엄 채널 구성",
        monthlyPrice: 20900,
      },
    ],

    bundleRules: createBundleRules("lg", [
      {
        tvPlanId: "lg-tv-value",
        prices: { "100M": 39600, "500M": 45100, "1G": 50600 },
        mobilePrices: { "100M": 34100, "500M": 35200, "1G": 37400 },
        rewards: { "100M": 400000, "500M": 470000, "1G": 470000 },
      },
      {
        tvPlanId: "lg-tv-basic",
        prices: { "100M": 40700, "500M": 46200, "1G": 51700 },
        mobilePrices: { "100M": 35200, "500M": 36300, "1G": 38500 },
        rewards: { "100M": 400000, "500M": 470000, "1G": 470000 },
      },
      {
        tvPlanId: "lg-tv-premium",
        prices: { "100M": 42900, "500M": 48400, "1G": 53900 },
        mobilePrices: { "100M": 37400, "500M": 38500, "1G": 40700 },
        rewards: { "100M": 400000, "500M": 470000, "1G": 470000 },
      },
    ]),
  },

  SK: {
    id: "SK",
    label: "SK",
    logo: "/carriers/sk.png",
    maxCardDiscount: 10000,

    internetPlans: [
      {
        id: "sk-internet-100",
        speed: "100M",
        name: "광랜",
        description: "기본 인터넷 사용",
        monthlyPrice: 22000,
        mobileDiscount: 4400,
        reward: reward(110000),
      },
      {
        id: "sk-internet-500",
        speed: "500M",
        name: "기가라이트",
        description: "가족과 여러 기기 사용",
        monthlyPrice: 33000,
        mobileDiscount: 11000,
        reward: reward(170000),
        recommended: true,
      },
      {
        id: "sk-internet-1g",
        speed: "1G",
        name: "기가",
        description: "고용량 작업과 방송",
        monthlyPrice: 38500,
        mobileDiscount: 13200,
        reward: reward(170000),
      },
    ],

    tvPlans: [
      {
        id: "sk-tv-economy",
        name: "이코노미",
        channels: 182,
        description: "경제적인 인기 채널",
        monthlyPrice: 12100,
        recommended: true,
      },
      {
        id: "sk-tv-standard",
        name: "스탠다드",
        channels: 235,
        description: "대표 기본 TV 상품",
        monthlyPrice: 15400,
      },
      {
        id: "sk-tv-all",
        name: "ALL",
        channels: 255,
        description: "다양한 프리미엄 채널",
        monthlyPrice: 18700,
      },
    ],

    bundleRules: createBundleRules("sk", [
      {
        tvPlanId: "sk-tv-economy",
        prices: { "100M": 34100, "500M": 41800, "1G": 47300 },
        mobilePrices: { "100M": 30800, "500M": 35200, "1G": 38500 },
        rewards: { "100M": 400000, "500M": 430000, "1G": 520000 },
      },
      {
        tvPlanId: "sk-tv-standard",
        prices: { "100M": 37400, "500M": 45100, "1G": 50600 },
        mobilePrices: { "100M": 34100, "500M": 38500, "1G": 41800 },
        rewards: { "100M": 400000, "500M": 430000, "1G": 520000 },
      },
      {
        tvPlanId: "sk-tv-all",
        prices: { "100M": 40700, "500M": 48400, "1G": 53900 },
        mobilePrices: { "100M": 37400, "500M": 41800, "1G": 45100 },
        rewards: { "100M": 400000, "500M": 430000, "1G": 520000 },
      },
    ]),
  },

  SkyLife: {
    id: "SkyLife",
    label: "스카이라이프",
    logo: "/carriers/skylife.png",
    maxCardDiscount: 18000,

    internetPlans: [
      {
        id: "sky-internet-100",
        speed: "100M",
        name: "100M 인터넷",
        description: "합리적인 요금의 기본 인터넷",
        monthlyPrice: 18150,
        mobileDiscount: 0,
        reward: reward(100000),
      },
      {
        id: "sky-internet-500",
        speed: "500M",
        name: "기가 500M",
        description: "가족과 여러 기기 사용",
        monthlyPrice: 24750,
        mobileDiscount: 0,
        reward: reward(140000),
        recommended: true,
      },
      {
        id: "sky-internet-1g",
        speed: "1G",
        name: "기가 1G",
        description: "대용량 작업과 방송",
        monthlyPrice: 30250,
        mobileDiscount: 0,
        reward: reward(150000),
      },
    ],

    tvPlans: [
      {
        id: "sky-tv-basic",
        name: "ipit TV Basic",
        channels: 194,
        description: "모든 기본 채널을 합리적으로",
        monthlyPrice: 12650,
        recommended: true,
      },
      {
        id: "sky-tv-plus",
        name: "ipit TV Plus",
        channels: 209,
        description: "고화질 채널을 더 풍성하게",
        monthlyPrice: 13750,
      },
    ],

    bundleRules: createBundleRules("sky", [
      {
        tvPlanId: "sky-tv-basic",
        prices: { "100M": 30800, "500M": 37400, "1G": 42900 },
        mobilePrices: { "100M": 29865, "500M": 37400, "1G": 42900 },
        rewards: { "100M": 350000, "500M": 420000, "1G": 480000 },
      },
      {
        tvPlanId: "sky-tv-plus",
        prices: { "100M": 31900, "500M": 38500, "1G": 44000 },
        mobilePrices: { "100M": 30965, "500M": 38500, "1G": 44000 },
        rewards: { "100M": 350000, "500M": 420000, "1G": 480000 },
      },
    ]),
  },

  HelloVision: {
    id: "HelloVision",
    label: "LG 헬로비전",
    logo: "/carriers/hellovision.png",
    maxCardDiscount: 18000,

    internetPlans: [
      {
        id: "hello-internet-100",
        speed: "100M",
        name: "광랜라이트",
        description: "서비스 지역별 요금 확인 필요",
        monthlyPrice: 16330,
        mobileDiscount: 0,
        reward: reward(130000),
      },
      {
        id: "hello-internet-500",
        speed: "500M",
        name: "기가라이트",
        description: "서비스 지역별 요금 확인 필요",
        monthlyPrice: 25190,
        mobileDiscount: 0,
        reward: reward(180000),
        recommended: true,
      },
      {
        id: "hello-internet-1g",
        speed: "1G",
        name: "플래티넘기가",
        description: "서비스 지역별 요금 확인 필요",
        monthlyPrice: 26400,
        mobileDiscount: 0,
        reward: reward(200000),
      },
    ],

    tvPlans: [
      {
        id: "hello-tv-plus",
        name: "헬로tv 플러스",
        channels: 102,
        description: "알뜰한 기본 채널",
        monthlyPrice: 7700,
        recommended: true,
      },
      {
        id: "hello-tv-economy",
        name: "UHD 이코노미",
        channels: 109,
        description: "기본 UHD 채널",
        monthlyPrice: 13200,
      },
      {
        id: "hello-tv-new-basic",
        name: "UHD 뉴베이직",
        channels: 245,
        description: "스포츠와 인기 채널",
        monthlyPrice: 15400,
      },
    ],

    bundleRules: createBundleRules("hello", [
      {
        tvPlanId: "hello-tv-plus",
        prices: { "100M": 24030, "500M": 32890, "1G": 34100 },
        rewards: { "100M": 230000, "500M": 310000, "1G": 340000 },
      },
      {
        tvPlanId: "hello-tv-economy",
        prices: { "100M": 29530, "500M": 38390, "1G": 39600 },
        rewards: { "100M": 300000, "500M": 350000, "1G": 400000 },
      },
      {
        tvPlanId: "hello-tv-new-basic",
        prices: { "100M": 31730, "500M": 40590, "1G": 41800 },
        rewards: { "100M": 300000, "500M": 350000, "1G": 400000 },
      },
    ]),
  },

  SKB: {
    id: "SKB",
    label: "SKB 알뜰",
    logo: "/carriers/skb.png",
    maxCardDiscount: 18000,

    internetPlans: [
      {
        id: "skb-internet-100",
        speed: "100M",
        name: "광랜",
        description: "Btv POP 지역 서비스",
        monthlyPrice: 19800,
        mobileDiscount: 2200,
        reward: reward(0),
      },
      {
        id: "skb-internet-500",
        speed: "500M",
        name: "기가라이트",
        description: "Btv POP 지역 서비스",
        monthlyPrice: 27500,
        mobileDiscount: 5500,
        reward: reward(0),
        recommended: true,
      },
      {
        id: "skb-internet-1g",
        speed: "1G",
        name: "기가",
        description: "Btv POP 지역 서비스",
        monthlyPrice: 33000,
        mobileDiscount: 5500,
        reward: reward(0),
      },
    ],

    tvPlans: [
      {
        id: "skb-tv-pop180",
        name: "Btv pop 180",
        channels: 186,
        description: "인기 채널 중심",
        monthlyPrice: 12100,
        recommended: true,
      },
      {
        id: "skb-tv-pop230",
        name: "Btv pop 230",
        channels: 231,
        description: "전 채널 중심",
        monthlyPrice: 9900,
      },
    ],

    bundleRules: createBundleRules("skb", [
      {
        tvPlanId: "skb-tv-pop180",
        prices: { "100M": 35200, "500M": 45100, "1G": 50600 },
        mobilePrices: { "100M": 33000, "500M": 39600, "1G": 45100 },
        rewards: { "100M": 310000, "500M": 350000, "1G": 350000 },
      },
      {
        tvPlanId: "skb-tv-pop230",
        prices: { "100M": 36300, "500M": 46200, "1G": 51700 },
        mobilePrices: { "100M": 34100, "500M": 40700, "1G": 46200 },
        rewards: { "100M": 310000, "500M": 350000, "1G": 350000 },
      },
    ]),
  },
};

export function getBundleRule(
  carrier: Carrier,
  speed: Speed,
  tvPlanId: string,
) {
  return internetData[carrier].bundleRules.find(
    (rule) => rule.speed === speed && rule.tvPlanId === tvPlanId,
  );
}
