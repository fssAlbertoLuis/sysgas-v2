import { Role } from "./ActionTypes";

const insertRole = (payload) => ({
  type: Role.INSERT_ROLE,
  payload
});

const updateList = (payload) => ({
  type: Role.UPDATE_LIST,
  payload
});

const RoleActions = {insertRole, updateList};

export default RoleActions;
