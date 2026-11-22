"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ExpenseCard from "@/components/ExpenseCard";
import MonthSelector from "@/components/MonthSelector";
import { CATEGORIES } from "@/lib/categories";
import { formatCLP } from "@/lib/format";
import {
  deleteExpense,
  expensesInMonth,
  fetchExpenses,
  sumAmounts,
} from "@/lib/expenses";
import type { Expense } from "@/lib/types";
import s from "@/styles/ui.module.scss";

export default function GastosPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date());
  const [categoryId, setCategoryId] = useState("all");

  useEffect(() => {
    fetchExpenses()
      .then(setExpenses)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const view = useMemo(() => {
    const inMonth = expensesInMonth(expenses, month);
    const filtered =
      categoryId === "all"
        ? inMonth
        : inMonth.filter((e) => e.category_id === Number(categoryId));
    return {
      filtered,
      filteredTotal: sumAmounts(filtered),
      monthTotal: sumAmounts(inMonth),
      overallTotal: sumAmounts(expenses),
    };
  }, [expenses, month, categoryId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={s.title}>Gastos</h1>
          <p className={s.subtitle}>Listado y filtros</p>
        </div>
        <Link href="/gastos/nuevo" className={`${s.btn} ${s.btnPrimary}`}>
          <Plus size={16} /> <span className="hidden sm:inline">Nuevo gasto</span>
        </Link>
      </div>

      <section
        className={`${s.card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <MonthSelector value={month} onChange={setMonth} />
        <select
          aria-label="Filtrar por categoría"
          className={`${s.input} sm:w-64`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${s.card} p-4`}>
          <p className={s.label}>Total filtrado</p>
          <p className="text-xl font-semibold tabular-nums">{formatCLP(view.filteredTotal)}</p>
        </div>
        <div className={`${s.card} p-4`}>
          <p className={s.label}>Total del mes</p>
          <p className="text-xl font-semibold tabular-nums">{formatCLP(view.monthTotal)}</p>
        </div>
        <div className={`${s.card} p-4`}>
          <p className={s.label}>Total general</p>
          <p className="text-xl font-semibold tabular-nums">{formatCLP(view.overallTotal)}</p>
        </div>
      </div>

      {error && <p className={s.error}>{error}</p>}

      <section className="flex flex-col gap-3">
        {loading ? (
          <p className={s.subtitle}>Cargando...</p>
        ) : view.filtered.length === 0 ? (
          <p className={s.empty}>No hay gastos para este filtro.</p>
        ) : (
          view.filtered.map((e) => (
            <ExpenseCard key={e.id} expense={e} onDelete={handleDelete} />
          ))
        )}
      </section>
    </div>
  );
}

