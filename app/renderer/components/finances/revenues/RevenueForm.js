import React, {useState} from 'react';
import { Card, Button, Icon, Divider, Intent, Dialog } from '@blueprintjs/core';
import CreateRevenue from './CreateRevenue';
import moment from "moment";
import SysDialog from '../../../utils/SysDialog';
const styles = {
  margin: 8,
};

const RevenueForm = ({
  filterDate, paymentTypeList, loading, sendRevenue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revenue, setRevenue] = useState({
    description: '', value: 0, paymentType: ''
  });

  return (
    <Card style={styles}>
      <div style={{display: 'flex'}}>
        <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="trending-up" /> Receitas 
        - {moment(filterDate).format('DD/MM/YYYY')}
        </h2>
        <div style={{flex: 1}} />
        <Button
          onClick={() => {
            setRevenue({
              description: '', value: 0, paymentType: ''
            });
            setIsOpen(true);
          }}
          large
          style={{alignSelf: 'center'}}
          icon="add" 
          text="Nova receita"
          intent={Intent.PRIMARY} 
        />
      </div>
      <SysDialog
        style={{padding: 0}}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CreateRevenue
          revenue={revenue} 
          setRevenue={setRevenue}
          paymentTypeList={paymentTypeList}
          sendRevenue={sendRevenue} 
          loading 
          setDialogOpen={setIsOpen}
        />
      </SysDialog>
    </Card>
  )
};

export default RevenueForm;
