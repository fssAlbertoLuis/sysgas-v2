import React, {useState} from 'react';
import { FormGroup, InputGroup, Card, ControlGroup, Divider, Button, Icon, HTMLSelect } from '@blueprintjs/core';
import LoaderButton from '../../utils/components/LoaderButton';
import CurrencyFormat from 'react-currency-format';

const styles = {
  margin: '4px',
}
const CreateCustomer = ({
  saveCustomer, loading, customer, setCustomer
}) => {

  const [displayPhone, setDisplayPhone] = useState(customer.phone);

  const handleChange = (field) => (e) => {
    setCustomer({...customer, [field]: e.target.value});
  }

  const send = async (e) => {
    e.preventDefault();
    saveCustomer(customer);
  }

  return (
    <Card>
      <h5 className="bp3-heading">
        <span><Icon  icon="user" /> </span>
        Cadastrar novo cliente
      </h5>
      <div className="bp3-text-muted">
        <p>Digite as informações do cliente</p>       
      </div>
      <Divider />
      <form onSubmit={send}>
        <ControlGroup vertical>
          <FormGroup
            helperText=""
            label="Nome"
            labelFor="text-input"
            style={styles}
          >
            <InputGroup 
              type="text" 
              name="customer.name" 
              disabled={loading}
              value={customer.name}
              onChange={handleChange('name')}
              required
              autoFocus
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Telefone"
            labelFor="text-input"
            style={styles}
          >
            <InputGroup 
              type="text" 
              name="customer.phone" 
              disabled={loading}
              value={displayPhone}
              onChange={(e) => {
                let value = e.target.value;
                value = value.replace(/\D/g,'');
                if (value.length < 9) {
                  const p1 = value.slice(0,4);
                  const p2 = value.slice(4,8);
                  if (value.length < 4) {
                    setDisplayPhone(p1);
                  } else {
                    if (p1.length === 4 && p2.length) {
                      setDisplayPhone(`${p1}-${p2}`);
                    } else {
                      setDisplayPhone(`${p1}`);
                    }
                  }
                  setCustomer({...customer, phone: value});
                } else if (value.length === 9) {
                  const p1 = value.slice(0,5);
                  const p2 = value.slice(5,9);
                  setDisplayPhone(`${p1}-${p2}`);
                  setCustomer({...customer, phone: value});
                }
              }}
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Tipo de cliente"
            labelFor="select-input"
            style={styles}
          >
            <HTMLSelect 
              options={['', 'cliente', 'empresa']}
              disabled={loading}
              value={customer.type}
              onChange={handleChange('type')}
              required
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Endereço"
            labelFor="text-input"
            style={{...styles, flex: 1}}
          >
            <InputGroup 
              type="text" 
              disabled={loading}
              name="customer.address" 
              value={customer.address}
              onChange={handleChange('address')}
              fill={true}
              required
            />
          </FormGroup>
        </ControlGroup>
        <LoaderButton 
          type="submit" 
          intent="primary" 
          icon="play" 
          style={styles}
          loading={loading}
        >Cadastrar</LoaderButton>
      </form>
    </Card>
  );
};

export default CreateCustomer;
