import { EstadoPromesa, ESTADO_COLORS } from "@/types/database";

export default function ProgressBar({
  percent,
  status,
  size = "md",
}: {
  percent: number;
  status: EstadoPromesa;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const color = ESTADO_COLORS[status];
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-slate-100 overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all`}
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
