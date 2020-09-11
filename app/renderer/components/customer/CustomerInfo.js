import React from 'react';
import CurrencyFormat from 'react-currency-format';

const CustomerInfo = ({customer}) => (
  <table className="bp3-html-table .modifier" style={{width: '100%'}}>
    <thead>
      <tr>
        <td colSpan="2" style={{textAlign: 'center'}}>
          Informações do cliente
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Nome:</b> </td>
        <td>{customer.name}</td>
      </tr>
      <tr>
        <td><b>Telefone:</b> </td>
        <td>
          <CurrencyFormat value={customer.phone} displayType={'text'} format={customer.phone.length > 8 ? '#####-####' : '####-####'} /></td>
      </tr>
      <tr>
        <td><b>Endereço:</b> </td>
        <td>{customer.address}</td>
      </tr>
    </tbody>
  </table>
);

export default CustomerInfo;
