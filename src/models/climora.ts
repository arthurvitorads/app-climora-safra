export type Coordinates = { lat: number; lng: number };

export type Property = {
  id: string;
  name: string;
  city: string;
  state: string;
  area: number;
  soil: string;
  notes: string;
  culture?: string;
  productivity?: number;
  unitPrice?: number;
  cost?: number;
  location?: Coordinates;
  boundary?: Coordinates[];
};
export type Crop = {
  id: string;
  propertyId: string;
  culture: string;
  cultivar: string;
  area: number;
  planted: string;
  harvest: string;
  productivity: number;
  unitPrice: number;
  cost: number;
};
export type Page = "dashboard" | "properties" | "alerts";
