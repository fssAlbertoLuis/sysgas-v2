import React, {useState} from 'react';
import {
  Card, ControlGroup, InputGroup, Button, Intent, FormGroup
} from '@blueprintjs/core';

export default ({filterCustomers}) => {

  const [search, setSearch] = useState('');
  return (
    <Card style={{margin: '0 8px'}}>
      <span>
        <ControlGroup vertical={false}
            style={{alignItems: 'flex-start'}}>
          <FormGroup
            label="Buscar cliente"
            labelFor="text-input"
            inline
          >
            <InputGroup
              id="search-input" 
              placeholder="digite o nome do cliente"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FormGroup>
          <Button 
            intent={Intent.SUCCESS} 
            text="Buscar" 
            onClick={() => filterCustomers(search)}
            icon="search"
          />
          <Button style={{marginLeft: 5}}
            intent={Intent.DANGER} 
            text="Remover pesquisa" 
            onClick={() => {filterCustomers(''); setSearch('')}} 
          />
        </ControlGroup>
      </span>
    </Card>
  )
}