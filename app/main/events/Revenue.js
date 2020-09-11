import {ipcMain } from 'electron';
import { Op } from 'sequelize';
import db from '../database/models';
import moment from 'moment';

export default () => {  
  ipcMain.on('revenue:getList', async (event, date, mode='day') => {
    try {
      const d = moment(date);
      const startOfDay = d.startOf(mode).toISOString();
      const endOfDay = d.endOf(mode).toISOString();  
      const data = await db.Revenue.findAll({
        include: [{
          model: db.Sale,
          include: ['Customer', 'Deliverer', 'SaleProducts']
        }],
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
      event.returnValue = data ? data.map(p => p.toJSON()) : [];
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('revenue:insert', async (event, revenueData) => {
    try {
      const insertedRevenue = await db.Revenue.create(revenueData);
      if (insertedRevenue) {
        const r = insertedRevenue.toJSON();
        event.returnValue = r;
      } else {
        event.returnValue = null;
      }
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('revenue:delete', async (event, id) => {
    try {
      const result = await db.Revenue.destroy({where:{id}});
      event.returnValue = result;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('revenue:saleWithDelivery', async (event, date) => {
    try {
      const d = moment(date);
      const startOfDay = d.startOf('day').toISOString();
      const endOfDay = d.endOf('day').toISOString();  
      const data = await db.Revenue.findAll({
        include: [{
          model: db.Sale,
          include: ['Customer', 'Deliverer'],
          where: {
            DelivererId: {
              [Op.ne]: null
            }
          },
        }],
        where: {
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        },
        
        order: [[db.Sale, 'delivered', 'ASC']]
      });
      event.returnValue = data ? data.map(p => p.toJSON()) : [];
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}
