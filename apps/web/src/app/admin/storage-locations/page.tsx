import Link from "next/link";
import { StorageLocationAdmin } from "../../../features/admin/storage-location-admin";

export default function AdminStorageLocationsPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Administration — Emplacements</h1>
          <p className="muted">
            Gérez les lieux de stockage proposés dans les formulaires d’inventaire.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="button-link secondary" href="/inventory">
            Inventaire
          </Link>
          <Link className="button-link secondary" href="/admin">
            Administration
          </Link>
        </div>
      </div>
      <StorageLocationAdmin />
    </main>
  );
}
