import React from 'react';
import { Icon, Divider, NumericInput, Colors } from '@blueprintjs/core';
import CurrencyFormat from 'react-currency-format';
import BaseTable from '../../utils/components/BaseTable';

const style = {
  title: {
    marginTop: '32px',
  },
  table: {
    width: '100%'
  }
};

const ProductCartTable = ({
  cart, handleChangeQuantity, deleteProduct
}) => {

  const deleteFromCart = (index) => {
    deleteProduct(index);
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div>
        <h5 className="bp3-heading" style={style.title}>
          <span><Icon icon="shopping-cart" /> Carrinho de compras</span>
        </h5>
        <Divider />
      </div>
      <div style={{flex: 1, overflow: 'auto'}}>
        <BaseTable 
          columns={[
            ['name', 'Produto'],
            [['index', 'quantity'], 'Qtd.', (index, qty) => (
              <>
                <NumericInput
                  fill
                  allowNumericCharactersOnly={true}
                  min={1}
                  selectAllOnFocus={true}
                  value={qty}
                  onValueChange={(value) => handleChangeQuantity(value, index)}
                  required
                />
                {
                  cart[index].quantity > cart[index].stock &&
                  <label 
                    className="bp3-ui-text bp3-text-small" 
                    style={{color: Colors.RED3}}
                  >
                    Produto sem estoque suficiente
                  </label>
                }
              </>
            )],
            ['price', 'Preço de venda', (price) => (
              <CurrencyFormat 
                value={price}
                displayType="text"
                thousandSeparator={true}
                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix={'R$'}
              />
            )],
            
            [['price', 'quantity'], 'Total', (price, quantity) => (
              <CurrencyFormat 
                value={price*quantity}
                displayType="text"
                thousandSeparator={true}
                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix={'R$'}
              />
            )],
            ['index', '', (index) => (
              <Icon
                onClick={() => deleteFromCart(index)}
                icon="trash" 
                intent="danger"
                style={{cursor: 'pointer'}}
              />
            )],
          ]}
          data={cart}
        />
      </div>
      <div>
        <Divider />
        <div style={{display: 'flex'}}>
          <div style={{flex: 2, textAlign: 'right', marginTop: 8, padding: 4}}>
            <h4 className="bp3-heading">
              Qtd. total: {
                cart.map(p => p.quantity).reduce((a, b) => a+ b, 0)
              }
            </h4>
          </div>
          <Divider />
          <div style={{flex: 1, marginTop: 8, padding: 4}}>
            <h4 className="bp3-heading">
              Total da venda: 
              <CurrencyFormat 
                value={
                  cart.map(
                    p => p.price * p.quantity).reduce(
                      (a, b) => a+ b, 0)
                }
                displayType="text"
                thousandSeparator={true}
                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix={'R$'}
              />
            </h4>
          </div>
      	</div>
      </div>
    </div>
  )
}

export default ProductCartTable;
