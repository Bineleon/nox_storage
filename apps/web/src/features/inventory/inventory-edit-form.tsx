"use client";

import { useRouter } from "next/navigation";
import { updateInventoryItem, type InventoryItemResponse } from "../../services/inventory.service";
import { InventoryForm } from "./inventory-form";

type InventoryEditFormProps = {
  id: string;
  item: InventoryItemResponse;
};

export function InventoryEditForm({ id, item }: InventoryEditFormProps) {
  const router = useRouter();
  const initialValues = {
    ...item,
    description: item.description ?? undefined,
    commentaire: item.commentaire ?? undefined,
    heightCm: item.heightCm ?? undefined,
    widthCm: item.widthCm ?? undefined,
    lengthCm: item.lengthCm ?? undefined,
    depthCm: item.depthCm ?? undefined
  };

  return (
    <InventoryForm
      initialValues={initialValues}
      submitLabel="Enregistrer"
      onSubmit={async payload => {
        const { photos, ...itemPayload } = payload;
        await updateInventoryItem(id, itemPayload);
        if (photos.length > 0) {
          const formData = new FormData();
          for (const photo of photos) {
            formData.append("files", photo);
          }
          await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/inventory-items/${id}/photos`, {
            method: "POST",
            body: formData
          });
        }
        router.push(`/inventory/${id}`);
      }}
    />
  );
}
