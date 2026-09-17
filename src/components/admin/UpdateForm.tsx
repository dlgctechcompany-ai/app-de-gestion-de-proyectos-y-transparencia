"use client";

import { useActionState, useRef, useEffect } from "react";
import { addUpdateAction, type ActionResult } from "@/app/admin/actions";

export default function UpdateForm({ promiseId }: { promiseId: string }) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    addUpdateAction,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const submittedOk = !state?.error;

  useEffect(() => {
    if (submittedOk && !pending) {
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-slate-200 p-4">
      <input type="hidden" name="promise_id" value={promiseId} />

      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">
          Qué se ha hecho / qué pasó
        </span>
        <textarea name="summary" rows={3} required className="input" />
      </label>

      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">
          Por qué no se ha hecho / qué falta (opcional)
        </span>
        <textarea name="blocker_reason" rows={2} className="input" />
      </label>

      <div className="grid sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">Fecha</span>
          <input
            type="date"
            name="update_date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Nuevo estado (opcional)
          </span>
          <select name="status" defaultValue="" className="input">
            <option value="">No cambiar</option>
            <option value="no_iniciada">No iniciada</option>
            <option value="en_progreso">En progreso</option>
            <option value="cumplida">Cumplida</option>
            <option value="estancada">Estancada</option>
            <option value="incumplida">Incumplida</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-slate-600 mb-1">
            Nuevo avance % (opcional)
          </span>
          <input type="number" name="progress_percent" min={0} max={100} className="input" />
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-medium text-slate-600 mb-1">URL fuente (opcional)</span>
        <input name="source_url" className="input" placeholder="https://..." />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Agregar actualización"}
      </button>
    </form>
  );
}
