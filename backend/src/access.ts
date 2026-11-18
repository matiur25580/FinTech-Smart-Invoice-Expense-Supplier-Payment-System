export type FinanceRole = "admin" | "accountant" | "supplier" | "employee";

export function canListExpenses(role: FinanceRole): boolean {
  return role === "admin" || role === "accountant" || role === "employee";
}

export function expenseStatusForRole(role: FinanceRole): "pending" | "approved" | null {
  if (role === "employee") return "pending";
  if (role === "admin" || role === "accountant") return "approved";
  return null;
}
