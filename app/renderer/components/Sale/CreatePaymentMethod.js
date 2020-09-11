import React, {useState} from 'react';
import {connect} from 'react-redux';
import { 
  FormGroup, 
  InputGroup, 
  Card, 
  ControlGroup, 
  Divider, 
  Button, 
  Icon,
  Spinner
} from '@blueprintjs/core';
import AlertActions from '../../redux/actions/AlertActions';
import SaleService from '../../services/SaleService';
import SaleActions from '../../redux/actions/SaleActions';

const styles = {
  margin: '4px',
}
const CreatePaymentInfo = ({insertPaymentMethod, openAlert}) => {

  const [paymentMethodName, setPaymentMethodName] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPaymentMethodName('');
  }

  const handleChange = (e) => {
    setPaymentMethodName(e.target.value);
  }

  const send = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await SaleService.insertPaymentMethod(paymentMethodName);
    if (result) {
      openAlert('success', 'Método de pagamento adicionado com sucesso!');
      insertPaymentMethod(paymentMethodName);
      resetForm();
    } else {
      openAlert('danger', 'Esse tipo de pagamento já existe');
    }
    setLoading(false);
  }

  return (
    <Card>
      <h5 className="bp3-heading">
        <span><Icon  icon="card" /> </span>
        Cadastrar novo método de pagamento
      </h5>
      <div className="bp3-text-muted">
        <p>Digite as informações do pagamento</p>       
      </div>
      <Divider />
      <form onSubmit={send}>
        <ControlGroup style={{alignItems: 'flex-end'}}>
          <FormGroup
            helperText=""
            label="Nome"
            labelFor="text-input"
            style={styles}
          >
            <InputGroup 
              type="text" 
              name="paymentMethodName" 
              disabled={loading}
              value={paymentMethodName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button 
            type="submit" 
            intent="primary"
            disabled={loading}
            icon={loading ? <Spinner size={Spinner.SIZE_SMALL} /> : 'play'} 
            style={styles}
          >{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        </ControlGroup>
      </form>
    </Card>
  );
};

const mapDispatchToProps = dispatch => ({
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
  insertPaymentMethod: (paymentMethodName) => 
    dispatch(
      SaleActions.insertPaymentMethod(paymentMethodName)
    ),
});

export default connect(null, mapDispatchToProps)(CreatePaymentInfo);
