import { z } from "zod";
import { inventoryStatusValues, inventoryVisibilityValues } from "../enums/inventory.js";

const optionalPositiveInteger = z.number().int().nonnegative().optional();

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120)
});

export const storageLocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
  addressLine: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(20),
  city: z.string().min(1).max(120)
});

export const inventoryPhotoSchema = z.object({
  id: z.string().uuid(),
  inventoryItemId: z.string().uuid(),
  url: z.string().url(),
  createdAt: z.string().datetime()
});

export const inventoryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(180),
  description: z.string().max(2000).nullable().optional(),
  quantity: z.number().int().positive(),
  heightCm: optionalPositiveInteger,
  widthCm: optionalPositiveInteger,
  lengthCm: optionalPositiveInteger,
  depthCm: optionalPositiveInteger,
  condition: z.string().min(1).max(120),
  commentaire: z.string().max(2000).nullable().optional(),
  visibility: z.enum(inventoryVisibilityValues),
  status: z.enum(inventoryStatusValues),
  categoryId: z.string().uuid(),
  storageLocationId: z.string().uuid(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  category: categorySchema.optional(),
  storageLocation: storageLocationSchema.optional(),
  photos: z.array(inventoryPhotoSchema).default([])
});

export const inventoryItemUpsertSchema = z.object({
  name: z.string().min(1).max(180),
  description: z.string().max(2000).nullable().optional(),
  quantity: z.number().int().positive(),
  heightCm: optionalPositiveInteger,
  widthCm: optionalPositiveInteger,
  lengthCm: optionalPositiveInteger,
  depthCm: optionalPositiveInteger,
  condition: z.string().min(1).max(120),
  commentaire: z.string().max(2000).nullable().optional(),
  visibility: z.enum(inventoryVisibilityValues),
  status: z.enum(inventoryStatusValues),
  categoryId: z.string().uuid(),
  storageLocationId: z.string().uuid()
});

export const inventoryPhotoUploadSchema = z.object({
  inventoryItemId: z.string().uuid(),
  files: z.array(z.object({
    filename: z.string().min(1),
    mimeType: z.string().min(1)
  })).min(1)
});

export const inventoryItemListQuerySchema = z.object({
  search: z.string().trim().optional(),
  categoryId: z.string().uuid().optional(),
  storageLocationId: z.string().uuid().optional(),
  visibility: z.enum(inventoryVisibilityValues).optional(),
  status: z.enum(inventoryStatusValues).optional()
});

export const categoryInputSchema = z.object({
  name: z.string().min(1).max(120)
});

export const storageLocationInputSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullable().optional(),
  addressLine: z.string().min(1).max(255),
  postalCode: z.string().min(1).max(20),
  city: z.string().min(1).max(120)
});

export type InventoryItemInput = z.infer<typeof inventoryItemUpsertSchema>;
export type InventoryItemListQuery = z.infer<typeof inventoryItemListQuerySchema>;
export type StorageLocationInput = z.infer<typeof storageLocationInputSchema>;
export type CategoryInput = z.infer<typeof categoryInputSchema>;
