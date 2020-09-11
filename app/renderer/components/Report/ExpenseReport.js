import React from 'react';
import { Divider, Callout, Intent } from '@blueprintjs/core';
import BRLCurrencyText from '../../utils/components/BRLCurrencyText';

const style = {
  margin: 8,
  flex: 1,
}

export default ({expenseReport, filterName}) => {

  return (
    <Callout style={style} intent={Intent.WARNING}>
      <h4 className="bp3-heading">Despesas - {filterName}</h4>
      <Divider />
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Despesas dinheiro</div>
        <div><BRLCurrencyText text={expenseReport.cash} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Despesas cartão:</div>
        <div><BRLCurrencyText text={expenseReport.card} /></div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>Total de despesas</div>
        <div><BRLCurrencyText text={expenseReport.cash+expenseReport.card} /></div>
      </div>
    </Callout>
  );
}
