"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";
import { formatCLP, formatDate } from "@/lib/format";
import type { Expense } from "@/lib/types";
import s from "@/styles/ui.module.scss";

type Props = { expense: Expense; onDelete?: (id: string) => void };

export default function ExpenseCard({ expense, onDelete }: Props) {
  return (
    <article className={`${s.card} flex items-center gap-4 p-4`}>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{expense.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
          <CategoryBadge categoryId={expense.category_id} />
          <span>{formatDate(expense.expense_date)}</span>
        </div>
      </div>

      <p className="whitespace-nowrap font-semibold tabular-nums">{formatCLP(expense.amount)}</p>

      <div className="flex gap-1">
        <Link href={`/gastos/${expense.id}`} className={s.iconBtn} aria-label="Editar gasto">
          <Pencil size={16} />
        </Link>
        {onDelete && (
          <button
            type="button"
            className={`${s.iconBtn} ${s.iconBtnDanger}`}
            aria-label="Eliminar gasto"
            onClick={() => {
              if (window.confirm("¿Eliminar este gasto?")) onDelete(expense.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
