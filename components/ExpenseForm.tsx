"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY_ID } from "@/lib/categories";
import { toISODate } from "@/lib/format";
import type { ExpenseInput } from "@/lib/types";
import s from "@/styles/ui.module.scss";

type Props = {
  initialValues?: Partial<ExpenseInput>;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (values: ExpenseInput) => Promise<void>;
};

// Muestra el monto con puntos de miles mientras se escribe
const formatDigits = (digits: string) =>
  digits ? new Intl.NumberFormat("es-CL").format(Number(digits)) : "";

export default function ExpenseForm({ initialValues, submitLabel, cancelHref, onSubmit }: Props) {
  const [amount, setAmount] = useState(initialValues?.amount ? String(initialValues.amount) : "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    String(initialValues?.category_id ?? DEFAULT_CATEGORY_ID)
  );
  const [date, setDate] = useState(initialValues?.expense_date ?? toISODate(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Ingresá un monto mayor a 0.");
      return;
    }
    if (!description.trim()) {
      setError("Escribí una descripción.");
      return;
    }
    if (!date) {
      setError("Elegí una fecha.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        amount: value,
        description: description.trim(),
        category_id: Number(categoryId),
        expense_date: date,
      });
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="amount" className={s.label}>Monto (CLP)</label>
        <input
          id="amount"
          inputMode="numeric"
          placeholder="0"
          autoFocus
          className={`${s.input} ${s.inputMoney}`}
          value={formatDigits(amount)}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
        />
      </div>

      <div>
        <label htmlFor="description" className={s.label}>Descripción</label>
        <input
          id="description"
          placeholder="Ej: Supermercado Lider"
          className={s.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={s.label}>Categoría</label>
          <select
            id="category"
            className={s.input}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className={s.label}>Fecha</label>
          <input
            id="date"
            type="date"
            className={s.input}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <p className={s.error}>{error}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className={`${s.btn} ${s.btnGhost}`}>Cancelar</Link>
        <button type="submit" disabled={saving} className={`${s.btn} ${s.btnPrimary}`}>
          {saving ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
