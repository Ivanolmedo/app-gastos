import { isSameMonth, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase/client";
import type { Expense, ExpenseInput } from "@/lib/types";

const SELECT = "id, amount, description, category_id, expense_date";

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchExpense(id: string): Promise<Expense> {
  const { data, error } = await supabase.from("expenses").select(SELECT).eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createExpense(input: ExpenseInput) {
  // user_id se completa solo con auth.uid() (default de la tabla)
  const { error } = await supabase.from("expenses").insert(input);
  if (error) throw error;
}

export async function updateExpense(id: string, input: ExpenseInput) {
  const { error } = await supabase.from("expenses").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

// Helpers de cálculo (el volumen de un uso personal permite filtrar en memoria)
export const sumAmounts = (list: Expense[]) => list.reduce((acc, e) => acc + e.amount, 0);

export const expensesInMonth = (list: Expense[], date: Date) =>
  list.filter((e) => isSameMonth(parseISO(e.expense_date), date));
