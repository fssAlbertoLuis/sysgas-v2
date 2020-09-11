import { Inventory } from "../actions/ActionTypes";

const initialState = {
  list: null,
};

export const InventoryReducer = (state=initialState, action) => {
  switch(action.type) {
    case Inventory.INSERT_ITEM:
      return {...state, list: [...state.list, action.payload]};
    case Inventory.UPDATE:
      return {...state, list: [...action.payload]};
    default:
      return {...state};
  }
}
