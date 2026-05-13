import { InventoryEditForm } from "../../../../features/inventory/inventory-edit-form";
import { getInventoryItem } from "../../../../services/inventory.service";

type InventoryEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InventoryEditPage({ params }: InventoryEditPageProps) {
  const { id } = await params;
  const item = await getInventoryItem(id);

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Modifier l’objet</h1>
          <p className="muted">Édition d’un élément d’inventaire.</p>
        </div>
      </div>
      <InventoryEditForm id={id} item={item} />
    </main>
  );
}
