import React from 'react';
import { Card, Icon } from '@blueprintjs/core';

const styles = {
  margin: 8,
};

const OptionsPageHeader = ({openDialog}) => {
  
  return (
    <Card style={styles}>
      <div style={{display: 'flex'}}>
        <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="settings" /> Configurações / Backup</h2>
        <div style={{flex: 1}} />
      </div>
    </Card>
  );
}

export default OptionsPageHeader;
