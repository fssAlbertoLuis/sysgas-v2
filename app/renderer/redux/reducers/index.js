import { AlertReducer } from './AlertReducer';
import { combineReducers } from 'redux';
import { RoleReducer } from './RoleReducer';
import { InventoryReducer } from './InventoryReducer';
import { CustomerReducer } from './CustomerReducer';
import { SaleReducer } from './SaleReducer';
import { ExpenseReducer } from './ExpenseReducer';
import { RevenueReducer } from './RevenueReducer';
import { ToastReducer } from './ToastReducer';
import { EmployeeReducer } from './EmployeeReducer';
import { OptionsReducer } from './OptionsReducer';

export const Reducers = combineReducers({
  alertState: AlertReducer,
  roleState: RoleReducer,
  inventoryState: InventoryReducer,
  customerState: CustomerReducer,
  saleState: SaleReducer,
  expenseState: ExpenseReducer,
  revenueState: RevenueReducer,
  toastState: ToastReducer,
  employeeState: EmployeeReducer,
  optionsState: OptionsReducer,
});
