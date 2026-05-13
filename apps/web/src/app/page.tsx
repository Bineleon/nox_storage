import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <h1>deco-storage</h1>
          <p className="muted">MVP de gestion d’inventaire déco.</p>
        </div>
        <Link className="button-link" href="/inventory">Voir l’inventaire</Link>
      </div>
    </main>
  );
}
