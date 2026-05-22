import type { CategoryInput } from "@deco/shared";
import { apiFetch } from "../lib/api";

export type CategoryResponse = {
  id: string;
  name: string;
};

export async function listCategories() {
  return apiFetch<CategoryResponse[]>("/categories");
}

export async function createCategory(payload: CategoryInput) {
  return apiFetch<CategoryResponse>("/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateCategory(id: string, payload: CategoryInput) {
  return apiFetch<CategoryResponse>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function deleteCategory(id: string) {
  return apiFetch<void>(`/categories/${id}`, {
    method: "DELETE"
  });
}
