import type { StorageLocationInput } from "@deco/shared";
import { apiFetch } from "../lib/api";

export type StorageLocationResponse = {
  id: string;
  name: string;
  description: string | null;
  addressLine: string;
  postalCode: string;
  city: string;
};

export async function listStorageLocations() {
  return apiFetch<StorageLocationResponse[]>("/storage-locations");
}

export async function createStorageLocation(payload: StorageLocationInput) {
  return apiFetch<StorageLocationResponse>("/storage-locations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateStorageLocation(id: string, payload: StorageLocationInput) {
  return apiFetch<StorageLocationResponse>(`/storage-locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteStorageLocation(id: string) {
  return apiFetch<void>(`/storage-locations/${id}`, {
    method: "DELETE"
  });
}
