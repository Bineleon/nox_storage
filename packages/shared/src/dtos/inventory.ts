import { z } from "zod";
import { inventoryItemSchema, storageLocationSchema, categorySchema } from "../schemas/inventory.js";

export type InventoryItemDto = z.infer<typeof inventoryItemSchema>;
export type CategoryDto = z.infer<typeof categorySchema>;
export type StorageLocationDto = z.infer<typeof storageLocationSchema>;
