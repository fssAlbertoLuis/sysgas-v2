import React from 'react';
import { Card, Intent, Icon } from '@blueprintjs/core';
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

const ProductList = ({
  setOpenDialog, setProduct,
  products, updateProduct, deleteProduct
}) => {

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [id, setId] = React.useState(null);

  return (
    <Card style={styles}>
      <BaseTable 
        columns={[
          ['name', 'Produto'],
          ['quantity', 'Quantidade'],
          ['price', 'Preço de venda', (value) => (
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
                  setProduct({
                    ...products[index], 
                    quantity: 0,
                    quantityStock: products[index].quantity,
                  });
                }}
              />
              <Icon 
                style={{margin: 4}} 
                icon="trash" 
                intent={Intent.DANGER} 
                onClick={() => {
                  setId(index);
                  setOpenConfirm(true);
                }}
              />
            </span>
          )]
        ]}
        data={products}
      />
      <SysConfirm 
        isOpen={openConfirm}
        message="Deseja realmente deletar esse produto?" 
        type="danger"
        onClose={(ok) => {
          if (ok && id !== null) {
            deleteProduct(id);
            setId(null);
          }
          setOpenConfirm(false);
        }}
      />
    </Card>
  )
}

export default ProductList;
