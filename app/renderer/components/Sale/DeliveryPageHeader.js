import React from 'react';
import { Card, Icon, Intent, Button } from '@blueprintjs/core';

const styles = {
  margin: 8,
};

const DeliveryPageHeader = ({openDialog, mode}) => {
  return (
    <Card style={styles}>
      <div style={{display: 'flex'}}>
  <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="box" /> Lista de entregas - {mode}</h2>
        <div style={{flex: 1}} />
      </div>
    </Card>
  );
}

export default DeliveryPageHeader;
