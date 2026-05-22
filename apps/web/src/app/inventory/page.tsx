import Link from "next/link";
import { listInventoryItems } from "../../services/inventory.service";

export default async function InventoryPage() {
  const items = await listInventoryItems();

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Inventaire</h1>
          <p className="muted">Vue liste des objets du MVP.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="button-link" href="/inventory/new">Nouvel objet</Link>
          <Link className="button-link secondary" href="/admin/categories">
            Catégories
          </Link>
        </div>
      </div>

      <section className="list">
        {items.map(item => (
          <article key={item.id} className="card">
            <h2>{item.name}</h2>
            <p className="muted">
              {item.category?.name ?? "Sans catégorie"} · {item.storageLocation?.name ?? "Sans emplacement"}
              {item.operatingLocation ? ` · ${item.operatingLocation}` : ""}
            </p>
            <p>Quantité: {item.quantity}</p>
            <Link href={`/inventory/${item.id}`}>Voir le détail</Link>
          </article>
        ))}
      </section>
    </main>
  );
}
