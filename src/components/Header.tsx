import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ¿Cumplió<span className="text-amber-500">?</span>
          </span>
          <span className="hidden sm:inline text-sm text-slate-500">
            menos blablá, más acción
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            Promesas
          </Link>
          <Link
            href="/admin"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}
