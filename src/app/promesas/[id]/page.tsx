import { createClient } from "@/lib/supabase/server";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PromiseUpdate, PromiseWithRelations } from "@/types/database";
import { ArrowLeft, Calendar, ExternalLink, AlertTriangle } from "lucide-react";

export const revalidate = 60;

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PromiseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: promise } = await supabase
    .from("promises")
    .select("*, official:officials(*), category:categories(*)")
    .eq("id", id)
    .maybeSingle<PromiseWithRelations>();

  if (!promise) notFound();

  const { data: updates } = await supabase
    .from("promise_updates")
    .select("*")
    .eq("promise_id", id)
    .order("update_date", { ascending: false })
    .returns<PromiseUpdate[]>();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft size={16} /> Todas las promesas
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          {promise.category && (
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: promise.category.color }}
            >
              {promise.category.name}
            </span>
          )}
          <StatusBadge status={promise.status} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-snug">
          {promise.title}
        </h1>

        <p className="text-sm text-slate-500 mb-6">
          {promise.official.name} · {promise.official.role} de{" "}
          {promise.official.territory}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs text-slate-400">Avance</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {promise.progress_percent}%
            </span>
          </div>
          <ProgressBar percent={promise.progress_percent} status={promise.status} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          {promise.promised_date && (
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={15} />
              Prometido: {formatDate(promise.promised_date)}
            </div>
          )}
          {promise.expected_date && (
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar size={15} />
              Meta esperada: {formatDate(promise.expected_date)}
            </div>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line mb-4">
          {promise.description}
        </div>

        {promise.source_url && (
          <a
            href={promise.source_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Ver fuente de la promesa <ExternalLink size={14} />
          </a>
        )}
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Historial de seguimiento
      </h2>

      {!updates || updates.length === 0 ? (
        <p className="text-sm text-slate-400">
          Todavía no hay actualizaciones registradas para esta promesa.
        </p>
      ) : (
        <ol className="relative border-l border-slate-200 pl-6 space-y-6">
          {updates.map((u) => (
            <li key={u.id}>
              <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-slate-300" />
              <p className="text-xs text-slate-400 mb-1">
                {formatDate(u.update_date)}
                {u.status && (
                  <>
                    {" "}
                    · <StatusBadge status={u.status} />
                  </>
                )}
              </p>
              <p className="text-sm text-slate-700 mb-1">{u.summary}</p>
              {u.blocker_reason && (
                <p className="flex items-start gap-1.5 text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2 mt-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  {u.blocker_reason}
                </p>
              )}
              {u.source_url && (
                <a
                  href={u.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 mt-1"
                >
                  Fuente <ExternalLink size={12} />
                </a>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
