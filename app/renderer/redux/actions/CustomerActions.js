import { Customer } from "./ActionTypes";

const insertCustomer = (customer) => ({
  type: Customer.INSERT,
  payload: customer,
});

const updateCustomersList = (customersList) => ({
  type: Customer.UPDATE_LIST,
  payload: customersList
})

const CustomerActions = {
  insertCustomer, updateCustomersList,
};

export default CustomerActions;
