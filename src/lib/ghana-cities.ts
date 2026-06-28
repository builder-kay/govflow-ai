import type { Coordinates } from "@/lib/geo";

export type GhanaCityId =
  | "all"
  | "accra"
  | "kumasi"
  | "cape-coast"
  | "tamale"
  | "takoradi";

export interface GhanaCity {
  id: GhanaCityId;
  label: string;
  region: string;
  coordinates: Coordinates | null;
}

export const GHANA_CITIES: GhanaCity[] = [
  { id: "all", label: "All areas", region: "Ghana", coordinates: null },
  {
    id: "accra",
    label: "Accra",
    region: "Greater Accra",
    coordinates: { lat: 5.6037, lon: -0.187 },
  },
  {
    id: "kumasi",
    label: "Kumasi",
    region: "Ashanti Region",
    coordinates: { lat: 6.6885, lon: -1.6244 },
  },
  {
    id: "cape-coast",
    label: "Cape Coast",
    region: "Central Region",
    coordinates: { lat: 5.1053, lon: -1.2466 },
  },
  {
    id: "tamale",
    label: "Tamale",
    region: "Northern Region",
    coordinates: { lat: 9.4034, lon: -0.8424 },
  },
  {
    id: "takoradi",
    label: "Takoradi",
    region: "Western Region",
    coordinates: { lat: 4.8845, lon: -1.7554 },
  },
];

const CITY_ID_SET = new Set(GHANA_CITIES.map((city) => city.id));

export function isGhanaCityId(value: string): value is GhanaCityId {
  return CITY_ID_SET.has(value as GhanaCityId);
}

export function getGhanaCity(cityId: GhanaCityId): GhanaCity {
  return GHANA_CITIES.find((city) => city.id === cityId) ?? GHANA_CITIES[0];
}

export const OFFICE_CITY_SUFFIXES = new Set<string>(
  GHANA_CITIES.filter((city) => city.id !== "all").map((city) => city.id)
);

/** Cities that have dedicated office listings in GovFlow */
export const CITIES_WITH_LISTED_OFFICES = new Set<GhanaCityId>([
  "accra",
  "kumasi",
  "cape-coast",
]);
