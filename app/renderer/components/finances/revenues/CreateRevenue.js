import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Card, Icon, Divider, ControlGroup, FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import ToastActions from '../../../redux/actions/ToastActions';
import LoaderButton from '../../../utils/components/LoaderButton';
import CurrencyFormat from 'react-currency-format';

const CreateRevenue = ({
  revenue, setRevenue, paymentTypeList, sendRevenue, setDialogOpen,
  showToast
}) => {
  const [selectList, setSelectList] = useState([
    {label: 'Selecione...', value: ''},
    ...paymentTypeList.map(v => ({
      label: v.paymentMethodName, value: v.paymentMethodName}
    ))
  ]);
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState(revenue.value);
  const handleChange = (field, numeric) => (e) => {
    setRevenue({
      ...revenue,
      [field]: numeric ? e : e.target.value
    })
  }

  return (
    <Card>
      <h3><span><Icon icon="add" /></span> Nova receita</h3>
      <Divider />
      <div>
      <form onSubmit={async (e) => {        
        e.preventDefault();
        setLoading(true);
        const result = await sendRevenue(revenue);
        setLoading(false);
        let success = false;
        if (result) {
          success = true;
          setDialogOpen(false);
          setRevenue({
            description: '', value: 0, paymentType: ''
          });
        }
        showToast(
          success ? 'success' : 'danger', 
          success ? 'Receita adicionada com sucesso.' : 'Problemas ao adicionar receita.');
      }}>
        <ControlGroup fill vertical>
          <FormGroup
            helperText=""
            label="Descrição"
            labelFor="Descrição"
          >
            <InputGroup required
              type="text" 
              name="revenue.description" 
              disabled={loading}
              value={revenue.description}
              onChange={handleChange('description')}
              autoFocus
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Valor pago"
            labelFor="text-input"
          >
            <CurrencyFormat
              leftIcon="dollar"
              onFocus={e => e.target.select()}
              customInput={InputGroup}
              value={displayValue} 
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              allowNegative={false}
              onValueChange={(values) => {
                const {formattedValue, value, floatValue} = values;
                setDisplayValue(formattedValue);
                setRevenue({...revenue, value: floatValue});
              }}
              disabled={loading}
              required
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Tipo de pagamento"
            labelFor="text-input"
          >
            <HTMLSelect required
              fill="true"
              options={selectList}
              value={revenue.paymentType}
              onChange={handleChange('paymentType')}
            />
          </FormGroup>
          <LoaderButton
            disabled={loading||!revenue.paymentType||!revenue.value||!revenue.description}
            type="submit" 
            intent="primary"
            loading={loading}
          >Cadastrar</LoaderButton>
        </ControlGroup>
      </form>
      </div>
    </Card>
  );
}

const mapDispatchToProps = dispatch => ({
  showToast: (type, message) => dispatch(ToastActions.show(type, message))
});

export default connect(null, mapDispatchToProps)(CreateRevenue);
