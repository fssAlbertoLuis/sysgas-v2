import {ipcMain } from 'electron';
import { Op } from 'sequelize';
import db from '../database/models';
import moment from 'moment';

export default () => {

  ipcMain.on('expense:getList', async (event, date, mode='day') => {
    try {
      const d = moment(date);
      const startOfDay = d.startOf(mode).toISOString();
      const endOfDay = d.endOf(mode).toISOString();  
      const data = await db.Expense.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      event.returnValue = data ? data.map(p => p.dataValues) : [];
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('expense:insert', async (event, expenseData) => {
    try {
      const insertedExpense = await db.Expense.create(expenseData);
      if (insertedExpense) {
        event.returnValue = insertedExpense.toJSON();
      } else {
        event.returnValue = null;
      }
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('expense:delete', async (event, id) => {
    try {
      const result = await db.Expense.destroy({where:{id}});
      event.returnValue = result;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}