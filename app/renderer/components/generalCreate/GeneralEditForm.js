import React, { useState } from 'react';
import LoaderButton from '../../utils/components/LoaderButton';
import { Card, Icon, Divider, ControlGroup, FormGroup, InputGroup } from '@blueprintjs/core';

export default ({obj, editFunction, setOpenDialog}) => {
  const [title, setTitle] = useState(obj.paymentMethodName ? 'Método de pagamento' : 'Entregador');
  const [text, setText] = useState(obj.paymentMethodName ? obj.paymentMethodName : obj.name);

  return (
    <Card>
      <h5 className="bp3-heading">
        <span><Icon  icon="edit" /> </span>
        Editar {title}
      </h5>
      <Divider />
      <ControlGroup vertical>
        <FormGroup
          helperText=""
          label="Nome"
          labelFor="text-input"
        >
          <InputGroup 
            type="text" 
            name="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            autoFocus
          />
        </FormGroup>
        <LoaderButton 
          type="submit" 
          intent="primary"
          disabled={!text}
          onClick={() => {
            editFunction({
              id: obj.id,
              [obj.paymentMethodName ? 'paymentMethodName':'name']: text,
            });
            setOpenDialog(false);
          }}
        >Editar</LoaderButton>
      </ControlGroup>
    </Card>
  )
}