import { createClient } from "@/lib/supabase/server";
import PromiseForm from "@/components/admin/PromiseForm";
import UpdateForm from "@/components/admin/UpdateForm";
import { deleteUpdateAction } from "@/app/admin/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Category, Official, PromiseUpdate, Promise_ } from "@/types/database";

export default async function EditPromisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: promise } = await supabase
    .from("promises")
    .select("*")
    .eq("id", id)
    .maybeSingle<Promise_>();

  if (!promise) notFound();

  const [{ data: officials }, { data: categories }, { data: updates }] = await Promise.all([
    supabase.from("officials").select("*").returns<Official[]>(),
    supabase.from("categories").select("*").order("sort_order").returns<Category[]>(),
    supabase
      .from("promise_updates")
      .select("*")
      .eq("promise_id", id)
      .order("update_date", { ascending: false })
      .returns<PromiseUpdate[]>(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft size={16} /> Panel
      </Link>

      <h1 className="text-xl font-bold text-slate-900 mb-2">Editar promesa</h1>
      <Link
        href={`/promesas/${promise.id}`}
        target="_blank"
        className="text-xs text-amber-600 hover:text-amber-700"
      >
        Ver página pública →
      </Link>

      <div className="mt-6 mb-10">
        <PromiseForm promise={promise} officials={officials ?? []} categories={categories ?? []} />
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-3">
        Agregar actualización de seguimiento
      </h2>
      <div className="mb-8">
        <UpdateForm promiseId={promise.id} />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
        Historial ({updates?.length ?? 0})
      </h2>
      <div className="space-y-2">
        {updates?.map((u) => (
          <div
            key={u.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-xs text-slate-400 mb-1">{u.update_date}</p>
              <p className="text-sm text-slate-700">{u.summary}</p>
            </div>
            <form action={deleteUpdateAction} className="shrink-0">
              <input type="hidden" name="id" value={u.id} />
              <input type="hidden" name="promise_id" value={promise.id} />
              <button className="text-xs text-red-500 hover:text-red-700">Eliminar</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
