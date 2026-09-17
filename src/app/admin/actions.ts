"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { EstadoPromesa, RolFuncionario } from "@/types/database";

export type ActionResult = { error?: string };

export async function signInAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Ingresa correo y contraseña." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Credenciales inválidas." };

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado.");
  return { supabase, user };
}

export async function saveOfficialAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    role: String(formData.get("role") || "presidente") as RolFuncionario,
    territory: String(formData.get("territory") || "Colombia").trim(),
    party: String(formData.get("party") || "").trim() || null,
    photo_url: String(formData.get("photo_url") || "").trim() || null,
    term_start: String(formData.get("term_start") || "") || null,
    term_end: String(formData.get("term_end") || "") || null,
    plan_gobierno_url: String(formData.get("plan_gobierno_url") || "").trim() || null,
  };

  if (!payload.name) return { error: "El nombre es obligatorio." };

  const { error } = id
    ? await supabase.from("officials").update(payload).eq("id", id)
    : await supabase.from("officials").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteOfficialAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "");
  await supabase.from("officials").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function saveCategoryAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "El nombre es obligatorio." };

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    color: String(formData.get("color") || "#64748b"),
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function savePromiseAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") || "");
  const payload = {
    official_id: String(formData.get("official_id") || ""),
    category_id: String(formData.get("category_id") || "") || null,
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    status: String(formData.get("status") || "no_iniciada") as EstadoPromesa,
    progress_percent: Number(formData.get("progress_percent") || 0),
    promised_date: String(formData.get("promised_date") || "") || null,
    expected_date: String(formData.get("expected_date") || "") || null,
    source_url: String(formData.get("source_url") || "").trim() || null,
  };

  if (!payload.official_id) return { error: "Selecciona un funcionario." };
  if (!payload.title) return { error: "El título es obligatorio." };

  const { data, error } = id
    ? await supabase.from("promises").update(payload).eq("id", id).select("id").single()
    : await supabase.from("promises").insert(payload).select("id").single();

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/promesas/${data.id}`);
}

export async function deletePromiseAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "");
  await supabase.from("promises").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function addUpdateAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const promise_id = String(formData.get("promise_id") || "");
  const status = String(formData.get("status") || "") as EstadoPromesa | "";
  const progressRaw = formData.get("progress_percent");

  const payload = {
    promise_id,
    update_date: String(formData.get("update_date") || "") || new Date().toISOString().slice(0, 10),
    summary: String(formData.get("summary") || "").trim(),
    blocker_reason: String(formData.get("blocker_reason") || "").trim() || null,
    progress_percent: progressRaw ? Number(progressRaw) : null,
    status: status || null,
    source_url: String(formData.get("source_url") || "").trim() || null,
  };

  if (!payload.summary) return { error: "Describe qué pasó en esta actualización." };

  const { error } = await supabase.from("promise_updates").insert(payload);
  if (error) return { error: error.message };

  // Sincroniza el estado/avance de la promesa si la actualización los trae
  const promiseUpdatePayload: Record<string, unknown> = {};
  if (payload.status) promiseUpdatePayload.status = payload.status;
  if (payload.progress_percent !== null)
    promiseUpdatePayload.progress_percent = payload.progress_percent;

  if (Object.keys(promiseUpdatePayload).length > 0) {
    await supabase.from("promises").update(promiseUpdatePayload).eq("id", promise_id);
  }

  revalidatePath("/");
  revalidatePath(`/promesas/${promise_id}`);
  revalidatePath(`/admin/promesas/${promise_id}`);
  return {};
}

export async function deleteUpdateAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") || "");
  const promise_id = String(formData.get("promise_id") || "");
  await supabase.from("promise_updates").delete().eq("id", id);
  revalidatePath(`/promesas/${promise_id}`);
  revalidatePath(`/admin/promesas/${promise_id}`);
  redirect(`/admin/promesas/${promise_id}`);
}
