export type EstadoPromesa =
  | "no_iniciada"
  | "en_progreso"
  | "cumplida"
  | "estancada"
  | "incumplida";

export type RolFuncionario = "presidente" | "gobernador" | "alcalde";

export interface Official {
  id: string;
  name: string;
  role: RolFuncionario;
  territory: string;
  party: string | null;
  photo_url: string | null;
  term_start: string | null;
  term_end: string | null;
  plan_gobierno_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
  sort_order: number;
}

export interface Promise_ {
  id: string;
  official_id: string;
  category_id: string | null;
  title: string;
  description: string;
  status: EstadoPromesa;
  progress_percent: number;
  promised_date: string | null;
  expected_date: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromiseUpdate {
  id: string;
  promise_id: string;
  update_date: string;
  summary: string;
  blocker_reason: string | null;
  progress_percent: number | null;
  status: EstadoPromesa | null;
  source_url: string | null;
  created_at: string;
}

export interface PromiseWithRelations extends Promise_ {
  official: Official;
  category: Category | null;
  updates?: PromiseUpdate[];
}

export const ESTADO_LABELS: Record<EstadoPromesa, string> = {
  no_iniciada: "No iniciada",
  en_progreso: "En progreso",
  cumplida: "Cumplida",
  estancada: "Estancada",
  incumplida: "Incumplida",
};

export const ESTADO_COLORS: Record<EstadoPromesa, string> = {
  no_iniciada: "#94a3b8",
  en_progreso: "#f59e0b",
  cumplida: "#16a34a",
  estancada: "#ea580c",
  incumplida: "#dc2626",
};
