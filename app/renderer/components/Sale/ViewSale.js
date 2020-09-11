import React from 'react';
import { Card, Divider, Icon, Button } from '@blueprintjs/core';
import CustomerInfo from '../customer/CustomerInfo';
import BRLCurrencyText from '../../utils/components/BRLCurrencyText';

const styles = {
  infoCell: {
    padding: 4,
    display: 'flex',
    justifyContent: 'space-between'
  }
}
const ViewSale = ({sale, setOpenDialog}) => {
  const showProductsTable = () => {
    const total = {qtd: 0, price: 0}
    return (
      <>
        <div style={{display: 'flex', lineHeight: 2}}>
          <div style={{flex: 1, ...styles.infoCell}}><b>#</b><Divider /></div>
          <div style={{flex: 4, ...styles.infoCell}}><b>produto</b><Divider /></div>
          <div style={{flex: 1, ...styles.infoCell}}><b>qtd.</b><Divider /></div>
          <div style={{flex: 1, ...styles.infoCell}}><b>preço</b></div>
        </div>
        <Divider />
        <div style={{maxHeight: 100, overflow: 'auto'}}>
        {
          sale.SaleProducts.map((p, index) => {
            total.qtd += p.quantity;
            total.price += p.quantity * p.price;
            return (
              <div style={{display: 'flex', lineHeight: 2}} key={index}>
                <div style={{flex: 1, ...styles.infoCell}}>{index+1}<Divider /></div>
                <div style={{flex: 4, ...styles.infoCell}}>{p.name}<Divider /></div>
                <div style={{flex: 1, ...styles.infoCell}}>{p.quantity}<Divider /></div>
                <div style={{flex: 1, ...styles.infoCell}}>
                  <BRLCurrencyText text={p.price} />
                </div>
              </div>
            );
          })
        }
        </div>
        <Divider />
        <div style={{display: 'flex', lineHeight: 2}}>
          <div style={{flex: 1, ...styles.infoCell}}><Divider /></div>
          <div style={{display: 'flex', justifyContent: 'flex-end', padding: 4}}>
            <b style={{marginRight: 4}}>Valor total de produtos: </b>
            <BRLCurrencyText text={total.price} />
          </div>
        </div>
        <div style={{display: 'flex', lineHeight: 2}}>
          <div style={{flex: 1, ...styles.infoCell}}><Divider /></div>
          <div style={{display: 'flex', justifyContent: 'flex-end', padding: 4}}>
            <b style={{marginRight: 4}}>Valor pago: </b>
            <BRLCurrencyText text={sale.paidValue} /><Divider />
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', padding: 4}}>
            <b style={{marginRight: 4}}>Troco: </b>
            <BRLCurrencyText text={sale.changeValue} />
          </div>
        </div>
      </>
    );
  };

  return (
    <Card>
      <h3><span><Icon icon="shopping-cart" /></span> Detalhes da venda</h3>
      <Divider />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {
          sale.Customer &&
          <div>
            <CustomerInfo customer={sale.Customer} />
            <Divider />
          </div>
        }
        <div style={{textAlign: 'center'}}>
          <b>Produtos vendidos</b>
          <Divider />
        </div>
        {
          showProductsTable()
        }
        <Divider />
        {
          sale.Deliverer &&
          <div style={{display: 'flex'}}>
            <div style={{display: 'flex', flex: 1, ...styles.infoCell}}>
              <div><b>Entregador:</b> {sale.Deliverer.name}</div>
              <Divider />
            </div>
            <div style={{display: 'flex', ...styles.infoCell}}>
              <div><b>Entregue:</b> {sale.delivered ? 'sim' : 'não'}</div>
            </div>
          </div>
        }
        {
          (sale.Customer && sale.Customer.type === 'empresa') &&
          <div style={{display: 'flex'}}>
            <div style={{display: 'flex', flex: 1, ...styles.infoCell}}>
              <div><b>Nf:</b> {sale.nf}</div>
              <Divider />
            </div>
          </div>
        }
        <Divider />
        <div style={{padding: 4, textAlign: 'right'}}>
          <Button
            style={{margin: 8}}
            intent="primary"
            large
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Fechar
          </Button>    
        </div>
      </div>
    </Card>
  );
};

export default ViewSale;
