import React from 'react';
import { Divider, Callout, Intent } from '@blueprintjs/core';
import BRLCurrencyText from '../../utils/components/BRLCurrencyText';

const style = {
  margin: 8,
  flex: 1,
}

export default ({generalReport, filterName}) => {
  return (
    <Callout style={style} intent={Intent.PRIMARY}>
      <h4 className="bp3-heading">Resumo - {filterName}</h4>
      <Divider />
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Caixa inicial</div>
        <div><BRLCurrencyText text={0} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total despesas</div>
        <div>
          <BRLCurrencyText 
            text={generalReport.expenses.cash+generalReport.expenses.card} />
          </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Sangria</div>
        <div><BRLCurrencyText text={0} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total dinheiro</div>
        <div><BRLCurrencyText text={generalReport.revenues.cash} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total cartão</div>
        <div><BRLCurrencyText text={generalReport.revenues.card} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total geral</div>
        <div>
          <BRLCurrencyText 
            text={generalReport.revenues.cash+generalReport.revenues.card} 
          />
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total líquido</div>
        <div>
          <BRLCurrencyText 
            text={generalReport.revenues.cash-(generalReport.expenses.cash+generalReport.expenses.card)} 
          />
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Caixa final</div>
        <div><BRLCurrencyText text={0} /></div>
      </div>
    </Callout>
  );
}
