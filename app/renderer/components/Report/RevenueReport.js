import React from 'react';
import { Divider, Callout, Intent } from '@blueprintjs/core';
import BRLCurrencyText from '../../utils/components/BRLCurrencyText';

const style = {
  margin: 8,
  flex: 1,
}

export default ({revenueReport, filterName}) => {

  return (
    <Callout style={style} intent={Intent.SUCCESS}>
      <h4 className="bp3-heading">Receitas - {filterName}</h4>
      <Divider />
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Vendas dinheiro</div>
        <div><BRLCurrencyText text={revenueReport.cash} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Vendas cartão:</div>
        <div><BRLCurrencyText text={revenueReport.card} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total de vendas</div>
        <div>
          <BRLCurrencyText 
            text={revenueReport.cash + revenueReport.card} 
          />
        </div>
      </div>
    </Callout>
  );
}
