import React, {useState} from 'react';
import { Card, Button, Icon, Divider, Intent, Dialog } from '@blueprintjs/core';
import CreateExpense from './CreateExpense';
import moment from "moment";
import SysDialog from '../../../utils/SysDialog';
const styles = {
  margin: 8,
};

const ExpenseForm = ({
  filterDate, paymentTypeList, loading, sendExpense,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expense, setExpense] = useState({
    description: '', value: 0, paymentType: '',
  });

  return (
    <Card style={styles}>
      <div style={{display: 'flex'}}>
        <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="trending-down" /> Despesas 
        - {moment(filterDate).format('DD/MM/YYYY')}
        </h2>
        <div style={{flex: 1}} />
        <Button
          onClick={() => {
            setExpense({
              description: '', value: 0, paymentType: '',
            });
            setIsOpen(true)
          }}
          large
          style={{alignSelf: 'center'}}
          icon="add" 
          text="Nova despesa"
          intent={Intent.PRIMARY} 
        />
      </div>
      <SysDialog
        style={{padding: 0}}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <CreateExpense
          expense={expense} 
          setExpense={setExpense}
          paymentTypeList={paymentTypeList}
          sendExpense={sendExpense} 
          loading 
          setDialogOpen={setIsOpen}
        />
      </SysDialog>
    </Card>
  )
};

export default ExpenseForm;
