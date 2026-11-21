import { formatCLP } from "@/lib/format";
import s from "@/styles/ui.module.scss";

type Props = {
  monthName: string;
  previousName: string;
  monthTotal: number;
  previousTotal: number;
  overallTotal: number;
};

export default function MonthlySummary({
  monthName,
  previousName,
  monthTotal,
  previousTotal,
  overallTotal,
}: Props) {
  const diff = monthTotal - previousTotal;
  const pct = previousTotal > 0 ? Math.round((diff / previousTotal) * 100) : null;
  const increased = diff > 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className={`${s.card} p-5`}>
        <p className={s.label}>Total de {monthName}</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">{formatCLP(monthTotal)}</p>
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: increased ? "var(--color-danger)" : "var(--color-success)" }}
        >
          {pct === null
            ? "Sin datos del mes anterior"
            : `${increased ? "+" : ""}${pct}% vs ${previousName}`}
        </p>
      </div>

      <div className={`${s.card} p-5`}>
        <p className={s.label}>Total {previousName}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCLP(previousTotal)}</p>
      </div>

      <div className={`${s.card} p-5`}>
        <p className={s.label}>Total general</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">{formatCLP(overallTotal)}</p>
      </div>
    </div>
  );
}
