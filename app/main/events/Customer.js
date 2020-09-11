import {ipcMain } from 'electron';
import db from '../database/models';

export default () => {

  ipcMain.on('customer:update', async (event, c) => { //c = customer
    try {
      let customer = await db.Customer.update(c, {where: {id: c.id}});
      if (customer) {
        customer = await db.Customer.findOne({where: {id: c.id}});
        event.returnValue = customer ? customer.toJSON() : null;  
      } else {
        event.returnValue = null;
      }
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('customer:insert', async (event, c) => { //c = customer
    try {
      const customer = await db.Customer.create(c);
      event.returnValue = customer ? customer.toJSON() : null;   
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}
