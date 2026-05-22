"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { InventoryItemInput } from "@deco/shared";

type InventoryFormProps = {
  initialValues?: Partial<InventoryItemInput>;
  onSubmit: (payload: InventoryItemInput & { photos: File[] }) => Promise<void> | void;
  submitLabel: string;
  disabled?: boolean;
  categoryOptions?: Array<{ id: string; name: string }>;
  storageOptions?: Array<{ id: string; name: string }>;
};

const defaultValues: InventoryItemInput = {
  name: "",
  description: "",
  quantity: 1,
  heightCm: undefined,
  widthCm: undefined,
  lengthCm: undefined,
  operatingLocation: "",
  condition: "Bon état",
  commentaire: "",
  visibility: "PRIVATE",
  status: "AVAILABLE",
  categoryId: "",
  storageLocationId: ""
};

export function InventoryForm({
  initialValues,
  onSubmit,
  submitLabel,
  disabled = false,
  categoryOptions,
  storageOptions
}: InventoryFormProps) {
  const mergedValues = useMemo(() => {
    const base: InventoryItemInput = { ...defaultValues, ...initialValues };
    if (categoryOptions?.length) {
      const defaultCat = categoryOptions[0];
      const cid = (initialValues?.categoryId ?? base.categoryId).trim();
      base.categoryId =
        defaultCat && cid && categoryOptions.some(c => c.id === cid) ? cid : (defaultCat?.id ?? base.categoryId);
    }
    if (storageOptions?.length) {
      const defaultLoc = storageOptions[0];
      const sid = (initialValues?.storageLocationId ?? base.storageLocationId).trim();
      base.storageLocationId =
        defaultLoc && sid && storageOptions.some(s => s.id === sid) ? sid : (defaultLoc?.id ?? base.storageLocationId);
    }
    return base;
  }, [initialValues, categoryOptions, storageOptions]);

  const [values, setValues] = useState(mergedValues);
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    setValues(mergedValues);
  }, [mergedValues]);

  const updateField = <K extends keyof InventoryItemInput>(field: K, value: InventoryItemInput[K]) => {
    setValues((current: InventoryItemInput) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="card grid"
      onSubmit={async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit({ ...values, photos });
      }}
    >
      <div className="grid grid-2">
        <div className="field">
          <label>Nom</label>
          <input value={values.name} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("name", event.target.value)} required />
        </div>
        <div className="field">
          <label>Catégorie</label>
          {categoryOptions && categoryOptions.length > 0 ? (
            <select
              value={values.categoryId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("categoryId", event.target.value)}
              required
            >
              {categoryOptions.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={values.categoryId}
              onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("categoryId", event.target.value)}
              required
            />
          )}
        </div>
        <div className="field">
          <label>Lieu d&apos;exploitation</label>
          <input
            value={values.operatingLocation ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("operatingLocation", event.target.value || undefined)
            }
          />
        </div>
        <div className="field">
          <label>Emplacement</label>
          {storageOptions && storageOptions.length > 0 ? (
            <select
              value={values.storageLocationId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("storageLocationId", event.target.value)}
              required
            >
              {storageOptions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={values.storageLocationId}
              onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("storageLocationId", event.target.value)}
              required
            />
          )}
        </div>
        <div className="field">
          <label>Quantité</label>
          <input type="number" min="1" value={values.quantity} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("quantity", Number(event.target.value))} required />
        </div>
        <div className="field">
          <label>État</label>
          <input value={values.condition} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("condition", event.target.value)} required />
        </div>
        <div className="field">
          <label>Visibilité</label>
          <select value={values.visibility} onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("visibility", event.target.value as InventoryItemInput["visibility"])}>
            <option value="PRIVATE">Privée</option>
            <option value="PUBLIC">Publique</option>
          </select>
        </div>
        <div className="field">
          <label>Statut</label>
          <select value={values.status} onChange={(event: ChangeEvent<HTMLSelectElement>) => updateField("status", event.target.value as InventoryItemInput["status"])}>
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Réservé</option>
            <option value="BORROWED">Emprunté</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>
        <div className="field">
          <label>Photos</label>
          <input type="file" accept="image/*" multiple onChange={(event: ChangeEvent<HTMLInputElement>) => setPhotos(Array.from(event.target.files ?? []))} />
        </div>
        <div className="field">
          <label>Hauteur (cm)</label>
          <input type="number" min="0" value={values.heightCm ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("heightCm", event.target.value === "" ? undefined : Number(event.target.value))} />
        </div>
        <div className="field">
          <label>Largeur (cm)</label>
          <input type="number" min="0" value={values.widthCm ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("widthCm", event.target.value === "" ? undefined : Number(event.target.value))} />
        </div>
        <div className="field">
          <label>Longueur (cm)</label>
          <input type="number" min="0" value={values.lengthCm ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => updateField("lengthCm", event.target.value === "" ? undefined : Number(event.target.value))} />
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={values.description ?? ""} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField("description", event.target.value)} />
      </div>
      <div className="field">
        <label>Commentaire</label>
        <textarea value={values.commentaire ?? ""} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField("commentaire", event.target.value)} />
      </div>
      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}
