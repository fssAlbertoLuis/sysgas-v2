import React from 'react';
import { Card, Icon, Intent, Button } from '@blueprintjs/core';

const styles = {
  margin: 8,
};

const ReportPageReader = ({filterTitle, setOpenConfirm}) => {
  return (
    <Card style={styles}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="folder-open" /> Relatório financeiro - {filterTitle}</h2>
        <div style={{flex: 1}} />
        <Button 
          text="Gerar excel" intent={Intent.SUCCESS}
          large
          onClick={()=>setOpenConfirm(true)}  
        />
      </div>
    </Card>
  );
}

export default ReportPageReader;
