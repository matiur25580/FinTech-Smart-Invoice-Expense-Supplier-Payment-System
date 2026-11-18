import test from "node:test";
import assert from "node:assert/strict";
import { canListExpenses, expenseStatusForRole } from "../src/access.js";

test("only finance staff and employees can list expenses", () => {
  assert.equal(canListExpenses("admin"), true);
  assert.equal(canListExpenses("accountant"), true);
  assert.equal(canListExpenses("employee"), true);
  assert.equal(canListExpenses("supplier"), false);
});

test("employees submit pending expenses while finance staff create approved records", () => {
  assert.equal(expenseStatusForRole("employee"), "pending");
  assert.equal(expenseStatusForRole("admin"), "approved");
  assert.equal(expenseStatusForRole("accountant"), "approved");
  assert.equal(expenseStatusForRole("supplier"), null);
});
