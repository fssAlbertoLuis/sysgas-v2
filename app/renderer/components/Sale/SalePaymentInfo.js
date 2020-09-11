import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
  Card, Icon, Divider, FormGroup, HTMLSelect,
  NumericInput, Button, ControlGroup, InputGroup
} from '@blueprintjs/core';
import CurrencyFormat from 'react-currency-format';

const style = {
  moneyInputDiv: {
    display: 'flex',
    width: '100%'
  },
  moneyInput: {
    margin: '4px',
    flex: 1,
  },
};

const SalePaymentInfo = ({
  sale, setSale, saleState, sendSale, employeeState,
}) => {
  const [selectList, setSelectList] = useState([
    {label: 'Selecione...', value: ''},
    ...saleState.paymentMethodList.map(v => ({
      label: v.paymentMethodName, value: v.paymentMethodName
    }))
  ]);
  const [displayPaidValue, setDisplayPaidValue] = useState(sale.paidValue);
  const [displayChange, setDisplayChange] = useState(sale.changeValue);
  const calculateChange = (value) => {
    const result = value - sale.totalValue;
      return result > 0 ? Number(result).toFixed(2) : 0;
  };

  const handleChange = (index, numeric) => e => {
    setSale({
      ...sale, [index]: numeric ? e : e.target.value,
      changeValue: numeric ? calculateChange(e) : sale.changeValue
    });
  }

  const validSale = () => {
    if (!sale.products.length) return false;
    if (sale.products.find(p => p.quantity < 1)) return false;
    if (sale.delivererId != '' && !sale.customer) return false;
    if (!saleState.paymentMethodList.map(p=> p.paymentMethodName).includes(sale.paymentType)) {
      return false;
    } else {
      return sale.totalValue == Number(sale.paidValue - sale.changeValue).toFixed(2);
    }
  }
  return (
    <Card style={{marginTop: '16px'}}>
      <h3 
        className="bp3-heading" 
        style={{display: 'flex', alignItems: 'center'}}
      > <Icon  icon="barcode" style={{marginRight:'8px'}} />
        Informações de pagamento
      </h3>
      <Divider />
      <ControlGroup fill vertical>
        {
          (sale.customer && sale.customer.type === 'empresa') &&
          <FormGroup
            style={style.moneyInput}
            helperText=""
            label="Número NF"
            labelFor="select-input"
          >
            <InputGroup 
              type="text" 
              name="sale.nf" 
              disabled={!sale.products.length}
              value={sale.nf}
              onChange={handleChange('nf')}
            />
          </FormGroup>
        }
        <FormGroup
          style={style.moneyInput}
          helperText=""
          label="Tipo de pagamento"
          labelFor="select-input"
        >
          <HTMLSelect
            fill="true"
            disabled={!sale.products.length}
            options={selectList}
            value={sale.paymentType}
            onChange={handleChange('paymentType')}
          />
        </FormGroup>
        <FormGroup
          style={style.moneyInput}
          helperText=""
          label="Entregador"
          labelFor="select-input"
        >
          <HTMLSelect
            fill="true"
            disabled={!sale.products.length||!employeeState.employeesList}
            options={employeeState.employeesList ? [
              {label: 'Selecionar entregador...', value: ''},
              ...employeeState.employeesList.map(e => (
                {label: e.name, value: e.id}
              ))
            ] : [{label: 'Buscando entregadores...', value: ''}]}
            value={sale.delivererId}
            onChange={handleChange('delivererId')}
          />
        </FormGroup>
      </ControlGroup>
      {
        sale.paymentType && 
        <div style={style.moneyInputDiv}>
          <FormGroup
            style={style.moneyInput}
            helperText=""
            label="Valor pago"
            labelFor="text-input"
          >
            <CurrencyFormat
              leftIcon="dollar"
              onFocus={e => e.target.select()}
              customInput={InputGroup}
              value={displayPaidValue} 
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              allowNegative={false}
              onValueChange={(values) => {
                const {formattedValue, value} = values;
                setDisplayPaidValue(formattedValue);
                setDisplayChange(Number(calculateChange(value)).toFixed(2).replace('.',','));
                setSale({
                  ...sale, paidValue: value,
                  changeValue: calculateChange(value)
                });
              }}
              required
            />
          </FormGroup>
          <FormGroup
            style={style.moneyInput}
            helperText=""
            label="Troco"
            labelFor="text-input"
          >
            <CurrencyFormat
              leftIcon="dollar"
              customInput={InputGroup}
              value={displayChange} 
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              allowNegative={false}
              required
              readOnly
            />
          </FormGroup>
        </div>
      }
      <div style={style.moneyInputDiv}>
        <Button
          style={{margin: '4px'}}
          fill="true"
          disabled={!validSale()}
          icon="play"
          intent="success"
          large
          onClick={() => {
            setDisplayChange(0);
            setDisplayPaidValue(0);
            sendSale();
          }}
        >Confirmar venda</Button>
      </div>       
    </Card>
  )
}

const mapStateToProps = state => ({
  employeeState: state.employeeState,
  saleState: state.saleState,
});

export default connect(mapStateToProps)(SalePaymentInfo);
