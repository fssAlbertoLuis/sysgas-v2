import { Expense } from "../actions/ActionTypes";

const initialState = {
  expenseList: null,
};

export const ExpenseReducer = (state=initialState, action) => {
  switch(action.type) {
    case Expense.INSERT:
      return {
        ...state, 
        expenseList: state.expenseList ? [
          action.payload, 
          ...state.expenseList
        ] : [action.payload]
      };
    case Expense.UPDATE:
      return {
        ...state, 
        expenseList: action.payload,
      };
    default:
      return {...state};
  }
}
