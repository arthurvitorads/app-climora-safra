import type { Crop } from "../models/climora";

export const profit = (crop: Crop) =>
  crop.area * crop.productivity * crop.unitPrice - crop.cost;
export const revenue = (
  crop: Pick<Crop, "area" | "productivity" | "unitPrice">,
) => crop.area * crop.productivity * crop.unitPrice;
