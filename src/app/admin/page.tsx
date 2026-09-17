import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { signOutAction, deletePromiseAction, deleteOfficialAction } from "./actions";
import OfficialForm from "@/components/admin/OfficialForm";
import CategoryForm from "@/components/admin/CategoryForm";
import StatusBadge from "@/components/StatusBadge";
import type { Category, Official, PromiseWithRelations } from "@/types/database";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: officials } = await supabase
    .from("officials")
    .select("*")
    .order("created_at")
    .returns<Official[]>();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  const { data: promises } = await supabase
    .from("promises")
    .select("*, official:officials(*), category:categories(*)")
    .order("created_at", { ascending: false })
    .returns<PromiseWithRelations[]>();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
        <form action={signOutAction}>
          <button className="text-sm text-slate-500 hover:text-slate-800">
            Cerrar sesión
          </button>
        </form>
      </div>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Funcionarios
        </h2>
        <div className="space-y-3 mb-3">
          {officials?.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{o.name}</p>
                <p className="text-xs text-slate-500">
                  {o.role} · {o.territory}
                </p>
              </div>
              <form action={deleteOfficialAction}>
                <input type="hidden" name="id" value={o.id} />
                <button className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
        <OfficialForm />
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Categorías
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories?.map((c) => (
            <span
              key={c.id}
              className="text-xs font-medium rounded-full px-3 py-1"
              style={{ backgroundColor: `${c.color}1a`, color: c.color }}
            >
              {c.name}
            </span>
          ))}
        </div>
        <CategoryForm />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Promesas ({promises?.length ?? 0})
          </h2>
          <Link
            href="/admin/promesas/nueva"
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            + Nueva promesa
          </Link>
        </div>

        <div className="space-y-2">
          {promises?.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{p.title}</p>
                <p className="text-xs text-slate-500">
                  {p.official?.name} · {p.category?.name ?? "sin categoría"} ·{" "}
                  {p.progress_percent}%
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={p.status} />
                <Link
                  href={`/admin/promesas/${p.id}`}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Editar
                </Link>
                <form action={deletePromiseAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                </form>
              </div>
            </div>
          ))}
          {promises?.length === 0 && (
            <p className="text-sm text-slate-400">Todavía no hay promesas cargadas.</p>
          )}
        </div>
      </section>
    </div>
  );
}
