import Link from "next/link";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import { PromiseWithRelations } from "@/types/database";

export default function PromiseCard({
  promise,
}: {
  promise: PromiseWithRelations;
}) {
  return (
    <Link
      href={`/promesas/${promise.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:shadow-sm transition-all"
    >
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
      <h3 className="font-semibold text-slate-900 leading-snug mb-2 group-hover:text-slate-700">
        {promise.title}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {promise.description}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={promise.progress_percent} status={promise.status} size="sm" />
        </div>
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {promise.progress_percent}%
        </span>
      </div>
      {promise.expected_date && (
        <p className="mt-3 text-xs text-slate-400">
          Meta: {new Date(promise.expected_date + "T00:00:00").toLocaleDateString("es-CO", { year: "numeric", month: "long" })}
        </p>
      )}
    </Link>
  );
}
