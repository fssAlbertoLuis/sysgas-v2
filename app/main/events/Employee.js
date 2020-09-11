import {ipcMain } from 'electron';
import db from '../database/models';

export default () => {

  ipcMain.on('employee:update', async (event, e) => { //c = employee
    try {
      let employee = await db.Employee.update(e, {where: {id: e.id}});
      event.returnValue = employee;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}
