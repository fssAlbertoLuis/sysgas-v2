import React from 'react';
import { Card, Intent, Icon, Tag } from '@blueprintjs/core';
import BaseTable from '../../utils/components/BaseTable';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import SysConfirm from '../alert/SysConfirm';

const styles = {
  margin: 8,
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto'
};

const DeliveriesList = ({deliveries, markAsDelivered}) => {

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [id, setId] = React.useState(null);

  return (
    <Card style={styles}>
      <BaseTable 
        columns={[
          ['description', 'Descrição'],
          ['value', 'Valor', (value) => (
            <CurrencyFormat 
              value={value}
              displayType="text"
              thousandSeparator={true}
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              fixedDecimalScale
              prefix={'R$'}
            />
          )],
          ['Sale', 'Cliente', (sale) => sale.Customer.name],
          ['Sale', 'Telefone', (sale) => (
            <CurrencyFormat 
              value={sale.Customer.phone}
              displayType="text"
              format={sale.Customer.phone.length > 8 ? '#####-####':'####-####'}
            />
          )],
          ['Sale', 'Endereço', (sale) => sale.Customer.address],
          ['Sale', 'Entregador', (sale) => sale.Deliverer.name],
          ['Sale', 'Situação', (sale) => (
            sale.delivered ?
            <Tag icon="tick" intent={Intent.SUCCESS}>Entregue</Tag> :
            <Tag icon="cross" intent={Intent.DANGER}>Pendente</Tag>
          )],
          ['index', '', (index) => (
            !deliveries[index].Sale.delivered &&
            <span>
              <Icon 
                icon="tick-circle" 
                intent={Intent.PRIMARY}
                onClick={() => {
                  setId(deliveries[index].Sale.id);
                  setOpenConfirm(true);
                }}
              />
            </span>
          )]
        ]}
        data={deliveries}
      />
      <SysConfirm 
        isOpen={openConfirm}
        message="Marcar venda como entregue?" 
        type="primary"
        onClose={(ok) => {
          if (ok && id !== null) {
            markAsDelivered(id);
            setId(null);
          }
          setOpenConfirm(false);
        }}
      />
    </Card>
  )
}

export default DeliveriesList;
