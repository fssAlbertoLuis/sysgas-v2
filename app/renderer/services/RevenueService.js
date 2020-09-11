import {ipcRenderer} from 'electron';

const insertRevenue = async ({description, value, paymentType}) => {
  try {
    const insertedRevenue = ipcRenderer.sendSync(
      'revenue:insert',
      {description, value, paymentType},
    );
    return insertedRevenue;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getRevenueList = async (date=new Date(), mode) => {
  try {
    const data = ipcRenderer.sendSync('revenue:getList', date, mode);
    return data;
  } catch (err) {
    console.log(err, 'getRevenueList');
    return false;
  }
}

const deleteRevenue = async (id) => {
  try {
    const result = ipcRenderer.sendSync('revenue:delete', id);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const RevenueService = {insertRevenue, getRevenueList, deleteRevenue};

export default RevenueService;
