import Link from "next/link";

export default function AdminPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Administration</h1>
          <p className="muted">Paramètres de l’application (utilisateur unique).</p>
        </div>
        <Link className="button-link" href="/">
          Accueil
        </Link>
      </div>
      <div className="card stack">
        <h2>Référentiels</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="button-link" href="/admin/categories">
            Catégories
          </Link>
          <Link className="button-link" href="/admin/storage-locations">
            Emplacements
          </Link>
        </div>
      </div>
    </main>
  );
}
