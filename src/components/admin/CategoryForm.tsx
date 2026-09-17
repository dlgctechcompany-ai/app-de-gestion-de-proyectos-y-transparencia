"use client";

import { useActionState, useState } from "react";
import { saveCategoryAction, type ActionResult } from "@/app/admin/actions";

export default function CategoryForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    saveCategoryAction,
    {}
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-amber-600 hover:text-amber-700"
      >
        + Agregar categoría
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 p-4">
      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">Nombre</span>
        <input name="name" required className="input" placeholder="Seguridad" />
      </label>
      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">Color</span>
        <input name="color" type="color" defaultValue="#f59e0b" className="h-9 w-14 rounded border border-slate-300" />
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-sm text-slate-500">
        Cancelar
      </button>
    </form>
  );
}
