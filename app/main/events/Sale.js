import {ipcMain } from 'electron';
import db from '../database/models';

export default () => {
  ipcMain.on('sale:insert', async (event, saleData) => {
    const t = await db.sequelize.transaction();
    try {
      const lastSale = await db.Sale.findAll({
        limit: 1, 
        attributes: ['id'],
        order: [['createdAt', 'DESC']]
      });
      if (lastSale) {
        const nextId = lastSale.length ? lastSale[0].id + 1 : 1;
        const revenue = {
          description: `Venda de produtos nº ${nextId}`,
          value: saleData.totalValue,
          paymentType: saleData.paymentType
        };
        const insertedRevenue = await db.Revenue.create(revenue, {
          transaction: t
        });

        const insertedSale = await db.Sale.create({
          RevenueId: insertedRevenue.id,
          CustomerId: saleData.customer ? saleData.customer.id : null,
          DelivererId: saleData.delivererId ? saleData.delivererId : null,
          paidValue: saleData.paidValue,
          changeValue: saleData.changeValue,
          nf: saleData.nf,
          delivered: false
        }, {transaction: t});
        const insertedProducts = await db.SaleProduct.bulkCreate(
          [...saleData.products.map(p => ({
            price: p.price,
            name: p.name, 
            quantity: p.quantity,
            SaleId: insertedSale.id}))],
          {transaction: t}
        );
        for (let i = 0; i < saleData.products.length; i++) {
          const p = saleData.products[i];
          await db.Product.update(
            {quantity: p.stock - p.quantity}, 
            {where: {id: p.id}, transaction: t}
          );
        }
        await t.commit();
        event.returnValue = {
          ...insertedRevenue,
          sale: {
            ...insertedSale.dataValues,
            products: [...insertedProducts.map(p => ({...p.dataValues}))]
          }
        };
      }
      event.returnValue = null;
    } catch (err) {
      t.rollback();
      event.returnValue = null;
    }
  });

  ipcMain.on('sale:markAsDelivered', (event, id) => {
    try {
      const result = db.Sale.update({delivered: true}, {where: {id}});
      event.returnValue = result ? true : false;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
  ipcMain.on('sale:updatePaymentMethod', (event, paymentMethod) => {
    try {
      const result = db.PaymentMethod.update(paymentMethod, {where: {id: paymentMethod.id}});
      event.returnValue = result ? true : false;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });
}
