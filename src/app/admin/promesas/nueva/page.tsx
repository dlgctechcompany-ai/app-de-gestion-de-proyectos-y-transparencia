import { createClient } from "@/lib/supabase/server";
import PromiseForm from "@/components/admin/PromiseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Category, Official } from "@/types/database";

export default async function NewPromisePage() {
  const supabase = await createClient();

  const { data: officials } = await supabase
    .from("officials")
    .select("*")
    .returns<Official[]>();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .returns<Category[]>();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft size={16} /> Panel
      </Link>
      <h1 className="text-xl font-bold text-slate-900 mb-6">Nueva promesa</h1>
      <PromiseForm officials={officials ?? []} categories={categories ?? []} />
    </div>
  );
}
