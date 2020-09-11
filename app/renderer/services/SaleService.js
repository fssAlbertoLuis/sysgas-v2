import {ipcRenderer} from 'electron';

const insertPaymentMethod = async (paymentMethodName) => {
  try {
    const paymentExists = ipcRenderer.sendSync(
      'get-model', 'PaymentMethod', 'findOne', {where: {paymentMethodName}
    });
    if (paymentExists) {
      return false;
    }
    const result = ipcRenderer.sendSync(
      'get-model', 'PaymentMethod', 'create', {paymentMethodName}
    );
    return result ? result.dataValues : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getPaymentMethodList = async () => {
  try {
    const d = ipcRenderer.sendSync('get-model', 'PaymentMethod', 'findAll');
    return d ? d.map(p => p.dataValues) : [];
  } catch (err) {
    console.log(err, 'getPaymentMethodList');
    return false;
  }
}

const insertSale = async (saleData) => {
  try {
    const insertedSale = ipcRenderer.sendSync('sale:insert', saleData);
    return insertedSale;
  } catch (err) {
    console.log(err)
    return false;
  }
}

const SaleService = {
  insertPaymentMethod, getPaymentMethodList, insertSale
};

export default SaleService;
