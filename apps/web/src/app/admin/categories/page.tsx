import Link from "next/link";
import { CategoryAdmin } from "../../../features/admin/category-admin";

export default function AdminCategoriesPage() {
  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Administration — Catégories</h1>
          <p className="muted">
            Gérez les catégories proposées dans les formulaires d’inventaire.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="button-link secondary" href="/inventory">
            Inventaire
          </Link>
          <Link className="button-link" href="/">
            Accueil
          </Link>
        </div>
      </div>
      <CategoryAdmin />
    </main>
  );
}
