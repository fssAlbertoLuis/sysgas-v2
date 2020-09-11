import {ipcMain } from 'electron';
import db from '../database/models';

export default () => {
  ipcMain.on('product:getByName', async (event, name) => {
    try {
      const product = await db.Product.findOne({where: {name}});
      event.returnValue =  product;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('product:insert', async (event, productData) => {
    try {
      const insertedProduct = await db.Product.create(productData);
      if (insertedProduct) {
        event.returnValue = {
          id: insertedProduct.id,
          name: insertedProduct.name,
          price: insertedProduct.price,
          quantity: insertedProduct.quantity
        }
      } else {
        event.returnValue = null;
      }
      return ;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  });

  ipcMain.on('product:update', async (event, productData, id) => {
    try {
      const updatedProduct = await db.Product.update(productData, {where: {id}});
      event.returnValue = updatedProduct;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  })

  ipcMain.on('product:delete', async (event, id) => {
    try {
      const result = await db.Product.destroy({where: {id}});
      event.returnValue = result;
    } catch (e) {
      console.log(e);
      event.returnValue = null;
    }
  })
}