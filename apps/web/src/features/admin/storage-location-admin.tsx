"use client";

import type { StorageLocationInput } from "@deco/shared";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createStorageLocation,
  deleteStorageLocation,
  listStorageLocations,
  updateStorageLocation,
  type StorageLocationResponse
} from "../../services/storage-location.service";
import {
  StorageLocationFormFields,
  emptyStorageLocationInput,
  toStorageLocationInput
} from "./storage-location-form-fields";

export function StorageLocationAdmin() {
  const [locations, setLocations] = useState<StorageLocationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newValues, setNewValues] = useState<StorageLocationInput>(emptyStorageLocationInput);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<StorageLocationInput>(emptyStorageLocationInput);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await listStorageLocations();
      setLocations(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Impossible de charger les emplacements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function isValid(input: StorageLocationInput): boolean {
    return (
      input.name.trim().length > 0 &&
      input.addressLine.trim().length > 0 &&
      input.postalCode.trim().length > 0 &&
      input.city.trim().length > 0
    );
  }

  function normalize(input: StorageLocationInput): StorageLocationInput {
    return {
      name: input.name.trim(),
      description: input.description?.trim() ? input.description.trim() : null,
      addressLine: input.addressLine.trim(),
      postalCode: input.postalCode.trim(),
      city: input.city.trim()
    };
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!isValid(newValues)) return;
    setPending(true);
    setError(null);
    try {
      await createStorageLocation(normalize(newValues));
      setNewValues(emptyStorageLocationInput);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "La création a échoué.");
    } finally {
      setPending(false);
    }
  }

  function startEdit(location: StorageLocationResponse) {
    setEditingId(location.id);
    setEditValues(toStorageLocationInput(location));
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues(emptyStorageLocationInput);
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    if (!editingId || !isValid(editValues)) return;
    setPending(true);
    setError(null);
    try {
      await updateStorageLocation(editingId, normalize(editValues));
      cancelEdit();
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "La modification a échoué.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(location: StorageLocationResponse) {
    const confirmed = window.confirm(`Supprimer l’emplacement « ${location.name} » ?`);
    if (!confirmed) return;
    setPending(true);
    setError(null);
    try {
      await deleteStorageLocation(location.id);
      if (editingId === location.id) {
        cancelEdit();
      }
      setLocations(prev => prev.filter(l => l.id !== location.id));
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "La suppression a échoué.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="stack">
      {error ? (
        <p className="error-banner" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? <p className="muted">Chargement…</p> : null}

      <section className="card stack">
        <h2>Nouvel emplacement</h2>
        <form className="stack" onSubmit={handleCreate}>
          <StorageLocationFormFields
            idPrefix="new"
            values={newValues}
            onChange={setNewValues}
            disabled={pending}
          />
          <button type="submit" disabled={pending || !isValid(newValues)}>
            {pending ? "Enregistrement…" : "Ajouter"}
          </button>
        </form>
      </section>

      <section className="card stack">
        <h2>Emplacements existants</h2>
        {!loading && locations.length === 0 ? (
          <p className="muted">Aucun emplacement. Ajoutez-en un ci-dessus.</p>
        ) : null}
        <ul className="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {locations.map(location =>
            editingId === location.id ? (
              <li key={location.id} className="card">
                <form className="stack" onSubmit={handleUpdate}>
                  <StorageLocationFormFields
                    idPrefix={`edit-${location.id}`}
                    values={editValues}
                    onChange={setEditValues}
                    disabled={pending}
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="submit" disabled={pending || !isValid(editValues)}>
                      Enregistrer
                    </button>
                    <button type="button" className="secondary" disabled={pending} onClick={cancelEdit}>
                      Annuler
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={location.id} className="card stack">
                <div>
                  <strong>{location.name}</strong>
                  {location.description ? (
                    <p className="muted" style={{ margin: "4px 0 0" }}>
                      {location.description}
                    </p>
                  ) : null}
                  <p className="muted" style={{ margin: "4px 0 0" }}>
                    {location.addressLine}, {location.postalCode} {location.city}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" className="secondary" disabled={pending} onClick={() => startEdit(location)}>
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    disabled={pending}
                    onClick={() => void handleDelete(location)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
