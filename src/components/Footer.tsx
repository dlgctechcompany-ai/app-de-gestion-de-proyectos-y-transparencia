export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-slate-400 flex flex-col sm:flex-row gap-2 justify-between">
        <p>
          Proyecto ciudadano independiente. Los datos se basan en fuentes
          públicas y se actualizan de forma manual — reporta un error si algo
          no cuadra.
        </p>
        <p>¿Cumplió? · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
