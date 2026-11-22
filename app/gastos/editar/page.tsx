"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";
import { fetchExpense, updateExpense } from "@/lib/expenses";
import type { Expense } from "@/lib/types";
import s from "@/styles/ui.module.scss";

export default function EditarGastoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExpense(id)
      .then(setExpense)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p className={s.error}>{error}</p>;
  if (!expense) return <p className={s.subtitle}>Cargando...</p>;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className={s.title}>Editar gasto</h1>
        <p className={s.subtitle}>Modificá los datos y guardá</p>
      </div>

      <section className={`${s.card} p-6`}>
        <ExpenseForm
          initialValues={expense}
          submitLabel="Guardar cambios"
          cancelHref="/gastos"
          onSubmit={async (values) => {
            await updateExpense(id, values);
            router.push("/gastos");
            router.refresh();
          }}
        />
      </section>
    </div>
  );
}
