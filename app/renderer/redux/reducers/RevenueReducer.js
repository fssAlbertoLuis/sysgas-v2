import { Revenue } from "../actions/ActionTypes";

const initialState = {
  revenueList: null,
};

export const RevenueReducer = (state=initialState, action) => {
  switch(action.type) {
    case Revenue.INSERT:
      return {
        ...state, 
        revenueList: state.revenueList ? [
          action.payload, 
          ...state.revenueList
        ] : [action.payload]
      };
    case Revenue.UPDATE:
      return {
        ...state, 
        revenueList: action.payload,
      };
    default:
      return {...state};
  }
}
