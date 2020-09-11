import React, { useState } from 'react';
import BaseContainer from '../../utils/components/BaseContainer';
import { 
  Card, ControlGroup, InputGroup, Button, Intent, FormGroup 
} from '@blueprintjs/core';

export default ({addTitle, sendFunction}) => {
  const [name, setName] = useState('');
  return (
    <Card style={{margin: '0 8px'}}>
      <span>
        <FormGroup
          label={addTitle}
          labelFor="text-input"
        >
          <ControlGroup vertical={false}
            style={{display: 'flex', alignItems: 'flex-start'}}
          >
            <InputGroup
              id="add-input" 
              placeholder={'digite o nome do '+addTitle}
              value={name}
              onChange={e => setName(e.target.value)}
              fill
            />
            <Button 
              intent={Intent.PRIMARY} 
              text="Adicionar" 
              onClick={() => {
                if (name) {
                  sendFunction(name);
                }
                setName('');
              }}
              icon="add"
            />
          </ControlGroup>
        </FormGroup>
      </span>
    </Card>
  );
}
