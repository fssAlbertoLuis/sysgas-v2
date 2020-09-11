import React, {useState} from 'react';
import {
  Card, ControlGroup, InputGroup, Button, Intent, FormGroup
} from '@blueprintjs/core';

export default ({filterProducts}) => {

  const [search, setSearch] = useState('');
  return (
    <Card style={{margin: '0 8px'}}>
      <span>
        <ControlGroup vertical={false}
            style={{alignItems: 'flex-start'}}>
          <FormGroup
            label="Buscar produto"
            labelFor="text-input"
            inline
          >
            <InputGroup
              id="search-input" 
              placeholder="digite o nome do produto"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </FormGroup>
          <Button 
            intent={Intent.SUCCESS} 
            text="Buscar" 
            onClick={() => filterProducts(search)}
            icon="search"
          />
          <Button style={{marginLeft: 5}}
            intent={Intent.DANGER} 
            text="Remover pesquisa" 
            onClick={() => {filterProducts(''); setSearch('')}} 
          />
        </ControlGroup>
      </span>
    </Card>
  )
}