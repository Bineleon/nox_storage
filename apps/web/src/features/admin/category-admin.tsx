"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
  type CategoryResponse
} from "../../services/category.service";

export function CategoryAdmin() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await listCategories();
      setCategories(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setPending(true);
    setError(null);
    try {
      await createCategory({ name });
      setNewName("");
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "La création a échoué.");
    } finally {
      setPending(false);
    }
  }

  function startEdit(category: CategoryResponse) {
    setEditingId(category.id);
    setEditName(category.name);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    if (!editingId) return;
    const name = editName.trim();
    if (!name) return;
    setPending(true);
    setError(null);
    try {
      await updateCategory(editingId, { name });
      cancelEdit();
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "La modification a échoué.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(category: CategoryResponse) {
    const confirmed = window.confirm(`Supprimer la catégorie « ${category.name} » ?`);
    if (!confirmed) return;
    setPending(true);
    setError(null);
    try {
      await deleteCategory(category.id);
      if (editingId === category.id) {
        cancelEdit();
      }
      setCategories(prev => prev.filter(c => c.id !== category.id));
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
        <h2>Nouvelle catégorie</h2>
        <form className="stack" onSubmit={handleCreate}>
          <div className="field">
            <label htmlFor="new-category-name">Nom</label>
            <input
              id="new-category-name"
              value={newName}
              onChange={event => setNewName(event.target.value)}
              maxLength={120}
              required
              disabled={pending}
            />
          </div>
          <button type="submit" disabled={pending || !newName.trim()}>
            {pending ? "Enregistrement…" : "Ajouter"}
          </button>
        </form>
      </section>

      <section className="card stack">
        <h2>Catégories existantes</h2>
        {!loading && categories.length === 0 ? (
          <p className="muted">Aucune catégorie. Ajoutez-en une ci-dessus.</p>
        ) : null}
        <ul className="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {categories.map(category =>
            editingId === category.id ? (
              <li key={category.id} className="card">
                <form className="stack" onSubmit={handleUpdate}>
                  <div className="field">
                    <label htmlFor={`edit-${category.id}`}>Nom</label>
                    <input
                      id={`edit-${category.id}`}
                      value={editName}
                      onChange={event => setEditName(event.target.value)}
                      maxLength={120}
                      required
                      disabled={pending}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="submit" disabled={pending || !editName.trim()}>
                      Enregistrer
                    </button>
                    <button type="button" className="secondary" disabled={pending} onClick={cancelEdit}>
                      Annuler
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={category.id}
                className="card"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}
              >
                <span>{category.name}</span>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button type="button" className="secondary" disabled={pending} onClick={() => startEdit(category)}>
                    Modifier
                  </button>
                  <button type="button" className="secondary" disabled={pending} onClick={() => void handleDelete(category)}>
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
