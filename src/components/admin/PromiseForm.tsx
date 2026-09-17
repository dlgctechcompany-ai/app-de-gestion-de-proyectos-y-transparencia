"use client";

import { useActionState } from "react";
import { savePromiseAction, type ActionResult } from "@/app/admin/actions";
import type { Category, Official, Promise_ } from "@/types/database";

export default function PromiseForm({
  promise,
  officials,
  categories,
}: {
  promise?: Promise_;
  officials: Official[];
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    savePromiseAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {promise && <input type="hidden" name="id" value={promise.id} />}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Funcionario</span>
          <select
            name="official_id"
            defaultValue={promise?.official_id || officials[0]?.id || ""}
            required
            className="input"
          >
            {officials.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.role})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Categoría</span>
          <select name="category_id" defaultValue={promise?.category_id || ""} className="input">
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">Título de la promesa</span>
        <input
          name="title"
          defaultValue={promise?.title}
          required
          className="input"
          placeholder="Ej: Reducir el hurto a personas en un 30%"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">
          Descripción (qué prometió exactamente)
        </span>
        <textarea
          name="description"
          defaultValue={promise?.description}
          rows={4}
          className="input"
        />
      </label>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Estado</span>
          <select name="status" defaultValue={promise?.status || "no_iniciada"} className="input">
            <option value="no_iniciada">No iniciada</option>
            <option value="en_progreso">En progreso</option>
            <option value="cumplida">Cumplida</option>
            <option value="estancada">Estancada</option>
            <option value="incumplida">Incumplida</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Avance (%)</span>
          <input
            type="number"
            name="progress_percent"
            min={0}
            max={100}
            defaultValue={promise?.progress_percent ?? 0}
            className="input"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Fecha meta</span>
          <input
            type="date"
            name="expected_date"
            defaultValue={promise?.expected_date || ""}
            className="input"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Fecha en que se prometió</span>
          <input
            type="date"
            name="promised_date"
            defaultValue={promise?.promised_date || ""}
            className="input"
          />
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            URL fuente (plan de gobierno, noticia, etc.)
          </span>
          <input
            name="source_url"
            defaultValue={promise?.source_url || ""}
            className="input"
            placeholder="https://..."
          />
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || officials.length === 0}
        className="rounded-lg bg-slate-900 text-white text-sm font-medium px-5 py-2.5 disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar promesa"}
      </button>
      {officials.length === 0 && (
        <p className="text-sm text-orange-600">
          Primero agrega un funcionario en el panel principal.
        </p>
      )}
    </form>
  );
}
