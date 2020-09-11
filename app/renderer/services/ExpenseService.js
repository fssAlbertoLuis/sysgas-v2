import { Sequelize } from 'sequelize';
import {ipcRenderer} from 'electron';

const insertExpense = async ({description, value, paymentType}) => {
  try {
    const insertedExpense = ipcRenderer.sendSync('expense:insert', {description, value, paymentType});
    return insertedExpense ? insertedExpense : null;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getExpenseList = async (date=new Date(), mode) => {
  try {
    const data = ipcRenderer.sendSync('expense:getList', date, mode);
    return data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const deleteExpense = async (id) => {
  try {
    const result = ipcRenderer.sendSync('expense:delete', id);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const ExpenseService = {insertExpense, getExpenseList, deleteExpense};

export default ExpenseService;
