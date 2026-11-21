export type Expense = {
  id: string;
  amount: number;
  description: string;
  category_id: number;
  expense_date: string; // yyyy-MM-dd
};

export type ExpenseInput = Omit<Expense, "id">;
