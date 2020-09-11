import { Sale } from "./ActionTypes";

const updatePaymentMethodList = (paymentMethodList) => ({
  type: Sale.UPDATE_PAYMENT_METHOD_LIST,
  payload: paymentMethodList,
});

const insertPaymentMethod = (paymentMethod) => ({
  type: Sale.INSERT_PAYMENT_METHOD,
  payload: paymentMethod,
});

const SaleActions = {
  updatePaymentMethodList, insertPaymentMethod,
};

export default SaleActions;
