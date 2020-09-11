import { Sale } from "../actions/ActionTypes";

const initialState = {
  paymentMethodList: null,
};

export const SaleReducer = (state=initialState, action) => {
  switch(action.type) {
    case Sale.UPDATE_PAYMENT_METHOD_LIST:
      return {
        ...state,
        paymentMethodList: [...action.payload]
      };
    case Sale.INSERT_PAYMENT_METHOD:
      return {
        ...state, 
        paymentMethodList: [...state.paymentMethodList, action.payload]
      };
    default:
      return {...state};
  }
}
