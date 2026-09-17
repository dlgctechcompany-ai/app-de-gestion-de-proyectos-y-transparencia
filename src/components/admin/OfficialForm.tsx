"use client";

import { useActionState, useState } from "react";
import { saveOfficialAction, type ActionResult } from "@/app/admin/actions";
import type { Official } from "@/types/database";

export default function OfficialForm({ official }: { official?: Official }) {
  const [open, setOpen] = useState(!official);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    saveOfficialAction,
    {}
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-amber-600 hover:text-amber-700"
      >
        + Agregar funcionario
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 p-4">
      {official && <input type="hidden" name="id" value={official.id} />}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nombre completo">
          <input
            name="name"
            defaultValue={official?.name}
            required
            className="input"
          />
        </Field>
        <Field label="Cargo">
          <select name="role" defaultValue={official?.role || "presidente"} className="input">
            <option value="presidente">Presidente</option>
            <option value="gobernador">Gobernador</option>
            <option value="alcalde">Alcalde</option>
          </select>
        </Field>
        <Field label="Territorio">
          <input
            name="territory"
            defaultValue={official?.territory || "Colombia"}
            className="input"
          />
        </Field>
        <Field label="Partido">
          <input name="party" defaultValue={official?.party || ""} className="input" />
        </Field>
        <Field label="Inicio de periodo">
          <input
            type="date"
            name="term_start"
            defaultValue={official?.term_start || ""}
            className="input"
          />
        </Field>
        <Field label="Fin de periodo">
          <input
            type="date"
            name="term_end"
            defaultValue={official?.term_end || ""}
            className="input"
          />
        </Field>
        <Field label="URL foto">
          <input name="photo_url" defaultValue={official?.photo_url || ""} className="input" />
        </Field>
        <Field label="URL plan de gobierno">
          <input
            name="plan_gobierno_url"
            defaultValue={official?.plan_gobierno_url || ""}
            className="input"
          />
        </Field>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
        {!official && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-slate-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>
      {children}
    </label>
  );
}
