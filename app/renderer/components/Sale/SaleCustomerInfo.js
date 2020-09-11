import React from 'react';
import { Card, Icon, Divider, Button } from '@blueprintjs/core';
import SearchCustomerInput from '../customer/SearchCustomerInput';
import CustomerInfo from '../customer/CustomerInfo';

const SaleCustomerInfo = ({sale, setSale}) => {
  const setSelectedCustomer = (customer) => {
    setSale({...sale, customer: customer});
  }
  return (
    <Card>
      <h3 
        className="bp3-heading" 
        style={{display: 'flex', alignItems: 'center'}}
      > <Icon  icon="user" style={{marginRight:'8px'}} />
        Informações cliente
      </h3>
      <Divider />
      <div style={{display: 'flex'}}>
        <SearchCustomerInput
          customer={sale.customer}
          setSelectedCustomer={setSelectedCustomer}
        />
        { sale.customer &&
        <Button
          intent="danger"
          icon="trash"
          text=""
          onClick={() => setSelectedCustomer(null)}
        />}
      </div>
      {
        sale.customer && <CustomerInfo customer={sale.customer} />
      }
    </Card>
  )
};

export default SaleCustomerInfo;
