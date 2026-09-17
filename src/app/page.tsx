import { createClient } from "@/lib/supabase/server";
import PromiseCard from "@/components/PromiseCard";
import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import type {
  Category,
  EstadoPromesa,
  Official,
  PromiseWithRelations,
} from "@/types/database";
import { ESTADO_LABELS } from "@/types/database";

export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; estado?: string }>;
}) {
  const { categoria, estado } = await searchParams;
  const supabase = await createClient();

  const { data: official } = await supabase
    .from("officials")
    .select("*")
    .eq("role", "presidente")
    .order("term_start", { ascending: false })
    .limit(1)
    .maybeSingle<Official>();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  let query = supabase
    .from("promises")
    .select("*, official:officials(*), category:categories(*)")
    .order("created_at", { ascending: false });

  if (official) query = query.eq("official_id", official.id);
  if (categoria) {
    const cat = categories?.find((c) => c.slug === categoria);
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (estado) query = query.eq("status", estado);

  const { data: promises } = await query.returns<PromiseWithRelations[]>();

  const { data: allPromisesForStats } = official
    ? await supabase
        .from("promises")
        .select("status, progress_percent")
        .eq("official_id", official.id)
        .returns<{ status: EstadoPromesa; progress_percent: number }[]>()
    : { data: [] };

  const total = allPromisesForStats?.length ?? 0;
  const avgProgress = total
    ? Math.round(
        (allPromisesForStats ?? []).reduce((s, p) => s + p.progress_percent, 0) / total
      )
    : 0;
  const cumplidas =
    allPromisesForStats?.filter((p) => p.status === "cumplida").length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {official && (
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
                {official.territory} · {official.role}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                {official.name}
              </h1>
              <p className="text-sm text-slate-500">
                Seguimiento a {total} {total === 1 ? "promesa" : "promesas"} de
                gobierno · {cumplidas} cumplida{cumplidas === 1 ? "" : "s"}
              </p>
            </div>
            <div className="sm:w-56">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-400">Avance general</span>
                <span className="text-lg font-bold text-slate-900 tabular-nums">
                  {avgProgress}%
                </span>
              </div>
              <ProgressBar percent={avgProgress} status="en_progreso" />
            </div>
          </div>
        </section>
      )}

      <div className="mb-8 flex flex-col gap-3">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <FilterPill
              href="/"
              active={!categoria}
              label="Todas las categorías"
            />
            {categories.map((c) => (
              <FilterPill
                key={c.id}
                href={`/?categoria=${c.slug}${estado ? `&estado=${estado}` : ""}`}
                active={categoria === c.slug}
                label={c.name}
              />
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <FilterPill
            href={categoria ? `/?categoria=${categoria}` : "/"}
            active={!estado}
            label="Todos los estados"
            muted
          />
          {(Object.keys(ESTADO_LABELS) as EstadoPromesa[]).map((s) => (
            <FilterPill
              key={s}
              href={`/?estado=${s}${categoria ? `&categoria=${categoria}` : ""}`}
              active={estado === s}
              label={ESTADO_LABELS[s]}
              muted
            />
          ))}
        </div>
      </div>

      {!promises || promises.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          {official
            ? "Todavía no hay promesas cargadas con estos filtros."
            : "Aún no hay un funcionario cargado. Ve al panel para agregar el primero."}
          <div className="mt-4">
            <Link
              href="/admin"
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              Ir al panel de administración →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promises.map((p) => (
            <PromiseCard key={p.id} promise={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
  muted,
}: {
  href: string;
  active: boolean;
  label: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
        active
          ? "bg-slate-900 text-white border-slate-900"
          : muted
          ? "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </Link>
  );
}
