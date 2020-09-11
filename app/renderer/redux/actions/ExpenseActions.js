import { Expense } from "./ActionTypes";

const insertExpense = (expense) => ({
  type: Expense.INSERT,
  payload: expense,
});

const updateExpense = (expenses) => ({
  type: Expense.UPDATE,
  payload: expenses,
});

const ExpenseActions = {insertExpense, updateExpense};

export default ExpenseActions;
