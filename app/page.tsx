"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { parseISO, subMonths, isSameMonth } from "date-fns";
import ExpenseCard from "@/components/ExpenseCard";
import MonthlySummary from "@/components/MonthlySummary";
import { CATEGORIES } from "@/lib/categories";
import { formatCLP, monthLabel } from "@/lib/format";
import { fetchExpenses, sumAmounts } from "@/lib/expenses";
import type { Expense } from "@/lib/types";
import s from "@/styles/ui.module.scss";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpenses()
      .then(setExpenses)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    const now = new Date();
    const prev = subMonths(now, 1);
    const current = expenses.filter((e) => isSameMonth(parseISO(e.expense_date), now));
    const previous = expenses.filter((e) => isSameMonth(parseISO(e.expense_date), prev));

    const byCategory = CATEGORIES.map((c) => ({
      ...c,
      total: sumAmounts(current.filter((e) => e.category_id === c.id)),
    ))
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      now,
      prev,
      monthTotal: sumAmounts(current),
      previousTotal: sumAmounts(previous),
      overallTotal: sumAmounts(expenses),
      byCategory,
      recent: expenses.slice(0, 5),
    };
  }, [expenses]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={s.title}>Resumen</h1>
        <p className={`${s.subtitle} capitalize`}>{monthLabel(data.now)}</p>
      </div>

      {error && <p className={s.error}>{error}</p>}
      {loading && <p className={s.subtitle}>Cargando...</p>}

      {!loading && (
        <>
          <MonthlySummary
            monthName={monthLabel(data.now)}
            previousName={monthLabel(data.prev)}
            monthTotal={data.monthTotal}
            previousTotal={data.previousTotal}
            overallTotal={data.overallTotal}
          />

          <section className={`${s.card} p-5`}>
            <h2 className="mb-4 font-semibold">Gastos por categoría este mes</h2>
            {data.byCategory.length === 0 ? (
              <p className={s.empty}>Todavía no hay gastos este mes.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {data.byCategory.map((c) => {
                  const pct = data.monthTotal ? (c.total / data.monthTotal) * 100 : 0;
                  return (
                    <li key={c.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{c.name}</span>
                        <span className="tabular-nums text-[var(--color-muted)]">
                          {formatCLP(c.total)} · {Math.round(pct)}%
                        </span>
                      </div>
                      <div className={s.track}>
                        <div className={s.fill} style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Últimos gastos</h2>
              <Link href="/gastos" className={`${s.btn} ${s.btnGhost}`}>Ver todos</Link>
            </div>
            {data.recent.length === 0 ? (
              <p className={s.empty}>Todavía no cargaste gastos.</p>
            ) : (
              data.recent.map((e) => <ExpenseCard key={e.id} expense={e} />)
            )}
          </section>
        </>
      )}
    </div>
  );
}
