import { EstadoPromesa, ESTADO_COLORS, ESTADO_LABELS } from "@/types/database";

export default function StatusBadge({ status }: { status: EstadoPromesa }) {
  const color = ESTADO_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {ESTADO_LABELS[status]}
    </span>
  );
}
