
import { Sequelize } from 'sequelize';
import {ipcRenderer} from 'electron';

const insertCustomer = async ({name, type, phone, address}) => {
  try {
    const Op = Sequelize.Op;
    const data = await db.Customer.findOne({
      where: {[Op.or]: [{name}, {phone}]}
    });
    if (data) {
      return false;
    } else {
      const insertedCustomer = await db.Customer.create({name,type,phone,address});
      return {
        id: insertedCustomer.id,
        name: insertedCustomer.name,
        phone: insertedCustomer.phone,
        address: insertedCustomer.address
      };
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getCustomers = async () => {
  try {
    const data = ipcRenderer.sendSync('get-model', 'Customer', 'findAll');
    return data ? data.map(d => d.dataValues) : [];
  } catch (err) {
    console.log(err);
    return false;
  }
}
const CustomerService = {
  insertCustomer, getCustomers,
};

export default CustomerService;
