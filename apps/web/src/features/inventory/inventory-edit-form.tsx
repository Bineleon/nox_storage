"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listCategories,
  listStorageLocations,
  updateInventoryItem,
  type InventoryItemResponse
} from "../../services/inventory.service";
import { InventoryForm } from "./inventory-form";

type InventoryEditFormProps = {
  id: string;
  item: InventoryItemResponse;
};

type Meta = {
  categories: Array<{ id: string; name: string }>;
  storageLocations: Array<{ id: string; name: string }>;
};

export function InventoryEditForm({ id, item }: InventoryEditFormProps) {
  const router = useRouter();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const initialValues = {
    ...item,
    description: item.description ?? undefined,
    commentaire: item.commentaire ?? undefined,
    heightCm: item.heightCm ?? undefined,
    widthCm: item.widthCm ?? undefined,
    lengthCm: item.lengthCm ?? undefined,
    operatingLocation: item.operatingLocation ?? undefined
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([listCategories(), listStorageLocations()])
      .then(([categories, storageLocations]) => {
        if (!cancelled) {
          setMeta({ categories, storageLocations });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setMetaError(error instanceof Error ? error.message : "Impossible de charger les listes.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (metaError) {
    return <p className="muted">{metaError}</p>;
  }

  if (!meta) {
    return <p className="muted">Chargement des catégories et emplacements…</p>;
  }

  if (meta.categories.length === 0) {
    return (
      <p className="muted">
        Aucune catégorie disponible.{" "}
        <a href="/admin/categories">Ajoutez des catégories dans l’administration</a>.
      </p>
    );
  }

  if (meta.storageLocations.length === 0) {
    return <p className="muted">Aucun emplacement en base. Lancez le seed : pnpm db:seed</p>;
  }

  return (
    <>
      {submitError ? <p className="muted">{submitError}</p> : null}
      <InventoryForm
        initialValues={initialValues}
        submitLabel={pending ? "Enregistrement…" : "Enregistrer"}
        disabled={pending}
        categoryOptions={meta.categories}
        storageOptions={meta.storageLocations}
        onSubmit={async payload => {
          setSubmitError(null);
          setPending(true);
          try {
            const { photos, ...itemPayload } = payload;
            await updateInventoryItem(id, itemPayload);
            if (photos.length > 0) {
              const formData = new FormData();
              for (const photo of photos) {
                formData.append("files", photo);
              }
              const photoRes = await fetch(`/api/inventory-items/${id}/photos`, {
                method: "POST",
                body: formData
              });
              if (!photoRes.ok) {
                const detail = (await photoRes.text()).trim().slice(0, 300);
                throw new Error(
                  detail.length > 0
                    ? `Photos : erreur ${photoRes.status} — ${detail}`
                    : `Photos : erreur ${photoRes.status}`
                );
              }
            }
            router.push(`/inventory/${id}`);
          } catch (error: unknown) {
            setSubmitError(error instanceof Error ? error.message : "La modification a échoué.");
          } finally {
            setPending(false);
          }
        }}
      />
    </>
  );
}
