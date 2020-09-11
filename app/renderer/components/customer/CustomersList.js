import React from 'react';
import { Card, Intent, Icon } from '@blueprintjs/core';
import BaseTable from '../../utils/components/BaseTable';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';

const styles = {
  margin: 8,
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto'
};

const CustomersList = ({
  setOpenDialog, setCustomer, customers
}) => {
  return (
    <Card style={styles}>
      <BaseTable 
        columns={[
          ['name', 'Cliente'],
          ['phone', 'Telefone', (value) => (
            <CurrencyFormat 
              value={value}
              displayType="text"
              format={value.length > 8 ? '#####-####':'####-####'}
            />
          )],
          ['address', 'Endereço'],
          ['type', 'Tipo de cliente'],
          ['createdAt', 'Adicionado em', (value) => moment(value).format('DD/MM/YYYY H:mm')],
          ['updatedAt', 'Atualizado em', (value) => moment(value).format('DD/MM/YYYY H:mm')],
          ['index', '', (index) => (
            <span>
              <Icon 
                style={{margin: 4}} 
                icon="edit" 
                intent={Intent.PRIMARY}
                onClick={() => {
                  setOpenDialog(true);
                  setCustomer({...customers[index]});
                }}
              />
            </span>
          )]
        ]}
        data={customers}
      />
    </Card>
  )
}

export default CustomersList;
