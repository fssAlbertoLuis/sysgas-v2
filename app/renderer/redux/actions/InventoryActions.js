import { Inventory } from "./ActionTypes";

const insertItem = (item) => ({
  type: Inventory.INSERT_ITEM,
  payload: item,
});

const updateInventory = (payload) => ({
  type: Inventory.UPDATE,
  payload,
});

const InventoryActions = {insertItem, updateInventory};

export default InventoryActions;
