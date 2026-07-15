export type Carrier =
  | "KT"
  | "LG U+"
  | "SK"
  | "SKB"
  | "SkyLife"
  | "HelloVision";

export type Speed =
  | "100M"
  | "500M"
  | "1G";


export type InternetProduct = {
  id: string;
  speed: Speed;
  name: string;

  internetPrice: number;

  mobileDiscount: number;

  cardDiscount: number;

  reward: number;
};


export type TvProduct = {
  id: string;
  name: string;
  channels: number;
  price: number;
};


export type CarrierData = {
  name: Carrier;

  products: InternetProduct[];

  tv: TvProduct[];
};


export const internetData: Record<
  Carrier,
  CarrierData
> = {

  "KT": {

    name: "KT",

    products: [
      {
        id: "kt-100",
        speed: "100M",
        name: "100메가 인터넷",
        internetPrice: 22000,
        mobileDiscount: 3300,
        cardDiscount: 22000,
        reward: 300000,
      },

      {
        id: "kt-500",
        speed: "500M",
        name: "500메가 인터넷",
        internetPrice: 33000,
        mobileDiscount: 5500,
        cardDiscount: 22000,
        reward: 450000,
      },

      {
        id: "kt-1g",
        speed: "1G",
        name: "기가 인터넷",
        internetPrice: 38500,
        mobileDiscount: 5500,
        cardDiscount: 22000,
        reward: 450000,
      },
    ],


    tv: [

      {
        id: "kt-basic",
        name: "베이직 TV",
        channels: 238,
        price: 11000,
      },

      {
        id: "kt-light",
        name: "라이트 TV",
        channels: 240,
        price: 13200,
      },

      {
        id: "kt-premium",
        name: "프리미엄 TV",
        channels: 250,
        price: 16500,
      },

    ],

  },


  "LG U+": {

    name: "LG U+",


    products: [],

    tv: [],

  },


  "SK": {

    name: "SK",

    products: [],

    tv: [],

  },


  "SKB": {

    name: "SKB",

    products: [],

    tv: [],

  },


  "SkyLife": {

    name: "SkyLife",

    products: [],

    tv: [],

  },


  "HelloVision": {

    name: "HelloVision",

    products: [],

    tv: [],

  },


};