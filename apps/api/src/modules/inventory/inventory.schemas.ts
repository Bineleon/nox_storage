import { z } from "zod";
import {
  categoryInputSchema,
  inventoryItemListQuerySchema,
  inventoryItemUpsertSchema,
  storageLocationInputSchema
} from "@deco/shared";

export const inventoryItemIdParamsSchema = z.object({
  id: z.string().uuid()
});

export const inventoryItemCreateSchema = inventoryItemUpsertSchema;
export const inventoryItemUpdateSchema = inventoryItemUpsertSchema;
export const inventoryItemListQuery = inventoryItemListQuerySchema;
export const inventoryPhotoUploadParamsSchema = inventoryItemIdParamsSchema;

export const categoryCreateSchema = categoryInputSchema;
export const storageLocationCreateSchema = storageLocationInputSchema;
