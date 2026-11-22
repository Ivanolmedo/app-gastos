"use client";

import { useRouter } from "next/navigation";
import ExpenseForm from "@/components/ExpenseForm";
import { createExpense } from "@/lib/expenses";
import s from "@/styles/ui.module.scss";

export default function NuevoGastoPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className={s.title}>Nuevo gasto</h1>
        <p className={s.subtitle}>Completá los datos del gasto</p>
      </div>

      <section className={`${s.card} p-6`}>
        <ExpenseForm
          submitLabel="Guardar gasto"
          cancelHref="/gastos"
          onSubmit={async (values) => {
            await createExpense(values);
            router.push("/gastos");
            router.refresh();
          }}
        />
      </section>
    </div>
  );
}
