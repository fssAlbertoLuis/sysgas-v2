import { Employee } from "../actions/ActionTypes";

const initialState = {
  employeesList: null,
};

export const EmployeeReducer = (state=initialState, action) => {
  switch(action.type) {
    case Employee.INSERT:
      return {
        ...state, employeesList: [...state.employeesList, action.payload]
      };
    case Employee.UPDATE_LIST:
      return {
        ...state, employeesList: [...action.payload]
      };
    default:
      return {...state};
  }
}
