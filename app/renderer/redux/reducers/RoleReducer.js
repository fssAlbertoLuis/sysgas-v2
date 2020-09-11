import { Role } from "../actions/ActionTypes";

const initialState = {
  roleList: null,
};

export const RoleReducer = (state=initialState, action) => {
  switch(action.type) {
    case Role.INSERT_ROLE:
      return {...state, roleList: [...state.roleList, action.payload]};
    case Role.UPDATE_LIST:
      return {...state, roleList: [...action.payload]};
    default:
      return {...state};
  }
}