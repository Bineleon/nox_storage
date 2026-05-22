import Link from "next/link";
import { getInventoryItem } from "../../../services/inventory.service";

type InventoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { id } = await params;
  const item = await getInventoryItem(id);

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>{item.name}</h1>
          <p className="muted">Détail de l’objet d’inventaire.</p>
        </div>
        <Link href={`/inventory/${item.id}/edit`}>Modifier</Link>
      </div>

      <div className="grid grid-2">
        <section className="card stack">
          <div><strong>Catégorie:</strong> {item.category?.name ?? item.categoryId}</div>
          <div><strong>Emplacement:</strong> {item.storageLocation?.name ?? item.storageLocationId}</div>
          <div><strong>Quantité:</strong> {item.quantity}</div>
          <div><strong>État:</strong> {item.condition}</div>
          <div><strong>Statut:</strong> {item.status}</div>
          <div><strong>Dimensions:</strong> {item.heightCm ?? "-"} × {item.widthCm ?? "-"} × {item.lengthCm ?? "-"} × {item.depthCm ?? "-"}</div>
          <div><strong>Commentaire:</strong> {item.commentaire ?? "-"}</div>
        </section>

        <section className="card stack">
          <h2>Photos</h2>
          {item.photos.length === 0 ? <p className="muted">Aucune photo.</p> : null}
          <div className="inventory-photos">
            {item.photos.map(photo => (
              <figure key={photo.id} className="inventory-photo">
                <a href={photo.url} target="_blank" rel="noreferrer">
                  <img
                    src={photo.url}
                    alt={`${item.name} — photo`}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
