"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InventoryForm } from "../../../features/inventory/inventory-form";
import {
  createInventoryItem,
  listCategories,
  listStorageLocations
} from "../../../services/inventory.service";

type Meta = {
  categories: Array<{ id: string; name: string }>;
  storageLocations: Array<{ id: string; name: string }>;
};

export default function NewInventoryPage() {
  const router = useRouter();
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Nouvel objet</h1>
          <p className="muted">Création d’un élément d’inventaire.</p>
        </div>
      </div>

      {metaError ? <p className="muted">{metaError}</p> : null}
      {!meta && !metaError ? <p className="muted">Chargement des catégories et emplacements…</p> : null}
      {meta && meta.categories.length === 0 ? (
        <p className="muted">
          Aucune catégorie disponible.{" "}
          <a href="/admin/categories">Ajoutez des catégories dans l’administration</a>.
        </p>
      ) : null}
      {meta && meta.storageLocations.length === 0 ? (
        <p className="muted">
          Aucun emplacement disponible.{" "}
          <a href="/admin/storage-locations">Ajoutez des emplacements dans l’administration</a>.
        </p>
      ) : null}
      {submitError ? <p className="muted">{submitError}</p> : null}

      {meta && meta.categories.length > 0 && meta.storageLocations.length > 0 ? (
        <InventoryForm
          submitLabel={pending ? "Création…" : "Créer"}
          disabled={pending}
          categoryOptions={meta.categories}
          storageOptions={meta.storageLocations}
          onSubmit={async payload => {
            setSubmitError(null);
            setPending(true);
            try {
              const { photos, ...item } = payload;
              const created = await createInventoryItem(item);
              if (photos.length > 0) {
                const formData = new FormData();
                for (const photo of photos) {
                  formData.append("files", photo);
                }
                const photoRes = await fetch(`/api/inventory-items/${created.id}/photos`, {
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
              router.push(`/inventory/${created.id}`);
            } catch (error: unknown) {
              setSubmitError(error instanceof Error ? error.message : "La création a échoué.");
            } finally {
              setPending(false);
            }
          }}
        />
      ) : null}
    </main>
  );
}
