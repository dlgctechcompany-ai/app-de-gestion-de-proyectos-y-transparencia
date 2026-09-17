"use client";

import { useActionState } from "react";
import { signInAction, type ActionResult } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(
    signInAction,
    {}
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-xl font-bold text-slate-900 mb-1">Panel ¿Cumplió?</h1>
      <p className="text-sm text-slate-500 mb-6">
        Acceso solo para el equipo editorial.
      </p>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Correo
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
