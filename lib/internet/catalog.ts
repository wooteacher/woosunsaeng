import {
  carrierOrder,
  internetData,
  type Carrier,
  type CarrierData,
} from "@/lib/internet/data";

export type InternetCatalog = {
  carrierOrder: Carrier[];
  internetData: Partial<Record<Carrier, CarrierData>>;
  source: "database" | "local";
};

export function getLocalInternetCatalog(): InternetCatalog {
  return {
    carrierOrder: [...carrierOrder],
    internetData,
    source: "local",
  };
}
