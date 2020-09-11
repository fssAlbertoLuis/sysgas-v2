import React from 'react';
import CurrencyFormat from 'react-currency-format';

const BRLCurrencyText = ({text}) => (
  <CurrencyFormat 
    value={text}
    displayType="text"
    thousandSeparator={true}
    decimalSeparator=","
    thousandSeparator="."
    decimalScale={2}
    fixedDecimalScale
    prefix={'R$'}
  />
);

export default BRLCurrencyText;
