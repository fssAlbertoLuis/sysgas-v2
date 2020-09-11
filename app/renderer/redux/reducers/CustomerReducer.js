import { Customer } from "../actions/ActionTypes";

const initialState = {
  customersList: null,
};

export const CustomerReducer = (state=initialState, action) => {
  switch(action.type) {
    case Customer.INSERT:
      return {
        ...state, customersList: [...state.customersList, action.payload]
      };
    case Customer.UPDATE_LIST:
      return {
        ...state, customersList: [...action.payload]
      };
    default:
      return {...state};
  }
}
