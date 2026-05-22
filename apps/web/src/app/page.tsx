import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <h1>deco-storage</h1>
          <p className="muted">MVP de gestion d’inventaire déco.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="button-link" href="/inventory">Voir l’inventaire</Link>
          <Link className="button-link secondary" href="/admin">
            Administration
          </Link>
        </div>
      </div>
    </main>
  );
}
