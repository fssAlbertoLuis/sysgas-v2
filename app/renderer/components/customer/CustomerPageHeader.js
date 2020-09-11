import React from 'react';
import { Card, Icon, Intent, Button } from '@blueprintjs/core';

const styles = {
  margin: 8,
};

const CustomerPageHeader = ({openDialog}) => {

  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Card style={styles}>
      <div style={{display: 'flex'}}>
        <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="user" /> Lista de clientes</h2>
        <div style={{flex: 1}} />
        <Button
          onClick={() => openDialog(true)}
          large
          style={{alignSelf: 'center'}}
          icon="add" 
          text="Novo cliente"
          intent={Intent.PRIMARY} 
        />
      </div>
    </Card>
  );
}

export default CustomerPageHeader;
