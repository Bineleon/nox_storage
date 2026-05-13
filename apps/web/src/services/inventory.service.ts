import type { InventoryItemInput, InventoryItemListQuery } from "@deco/shared";
import { apiFetch } from "../lib/api";

export type InventoryItemResponse = {
  id: string;
  name: string;
  description?: string | null;
  quantity: number;
  heightCm?: number | null;
  widthCm?: number | null;
  lengthCm?: number | null;
  depthCm?: number | null;
  condition: string;
  commentaire?: string | null;
  visibility: "PRIVATE" | "PUBLIC";
  status: "AVAILABLE" | "RESERVED" | "BORROWED" | "ARCHIVED";
  categoryId: string;
  storageLocationId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string };
  storageLocation?: { id: string; name: string };
  photos: Array<{ id: string; url: string; createdAt: string }>;
};

export async function listCategories() {
  return apiFetch<Array<{ id: string; name: string }>>("/categories");
}

export async function listStorageLocations() {
  return apiFetch<Array<{ id: string; name: string }>>("/storage-locations");
}

export async function listInventoryItems(query: InventoryItemListQuery = {}) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      searchParams.set(key, String(value));
    }
  }
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiFetch<InventoryItemResponse[]>(`/inventory-items${suffix}`);
}

export async function getInventoryItem(id: string) {
  return apiFetch<InventoryItemResponse>(`/inventory-items/${id}`);
}

export async function createInventoryItem(payload: InventoryItemInput) {
  return apiFetch<InventoryItemResponse>("/inventory-items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateInventoryItem(id: string, payload: InventoryItemInput) {
  return apiFetch<InventoryItemResponse>(`/inventory-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteInventoryItem(id: string) {
  return apiFetch<void>(`/inventory-items/${id}`, {
    method: "DELETE"
  });
}
