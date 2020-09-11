import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
  Divider, Card, Icon, ControlGroup, InputGroup,
  FormGroup, NumericInput, HTMLSelect,
} from '@blueprintjs/core';
import LoaderButton from '../../../utils/components/LoaderButton';
import ToastActions from '../../../redux/actions/ToastActions';
import CurrencyFormat from 'react-currency-format';

const CreateExpense = ({
  paymentTypeList, expense, setExpense, sendExpense, setDialogOpen, showToast
}) => {

  const [selectList, setSelectList] = useState([
    {label: 'Selecione...', value: ''},
    ...paymentTypeList.map(v => ({
      label: v.paymentMethodName, value: v.paymentMethodName
    }))
  ]);
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState(expense.value);
  const handleChange = (field, numeric) => (e) => {
    setExpense({
      ...expense,
      [field]: numeric ? parseFloat(e) : e.target.value
    })
  }

  return (
    <Card>
      <h3><span><Icon icon="add" /></span> Nova despesa</h3>
      <Divider />
      <div>
      <form onSubmit={async (e) => {        
        e.preventDefault();
        setLoading(true);
        const result = await sendExpense(expense);
        setLoading(false);
        let success = false;
        if (result) {
          success = true;
          setDialogOpen(false);
          setExpense({
            description: '', value: 0, paymentType: '',
          });
        }
        showToast(
          success ? 'success' : 'danger', 
          success ? 'Despesa adicionada com sucesso.' : 'Problemas ao adicionar despesa.');
      }}>
        <ControlGroup fill vertical>
          <FormGroup
            helperText=""
            label="Descrição"
            labelFor="Descrição"
          >
            <InputGroup required
              type="text" 
              name="expense.description" 
              disabled={loading}
              value={expense.description}
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
                setExpense({...expense, value: floatValue});
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
              value={expense.payment_type}
              onChange={handleChange('paymentType')}
            />
          </FormGroup>
          <LoaderButton
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

export default connect(null, mapDispatchToProps)(CreateExpense);
