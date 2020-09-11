import React, {useState} from 'react';
import { Card, HTMLTable, Icon, Spinner, Intent } from '@blueprintjs/core';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import SysConfirm from '../../alert/SysConfirm';

const styles = {
  height: '100%',
  overflow: 'hidden',
  margin: 8,
  overflowY: 'auto',
};

const tblStyle = {
  width: '100%',
}

const ExpensesList = ({deleteExpense, expenses}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(0);

  const expenseRows = (list) => (
    list.length ? (
      list.map((expense, index) => (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{expense.description}</td>
          <td>{expense.paymentType}</td>
          <td>
            <CurrencyFormat 
              value={expense.value}
              displayType="text"
              thousandSeparator={true}
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              fixedDecimalScale
              prefix={'R$'}
            />
          </td>
          <td>{moment(expense.createdAt).format('DD/MM/YYYY H:mm')}</td>
          <td style={{textAlign: 'center'}}>
            <Icon intent={Intent.DANGER} icon="trash" onClick={() => {
              setId(index);
              setIsOpen(true);
            }}/>
          </td>
        </tr>
      ))
    ) : (
    <tr>
      <td colSpan="6" style={{textAlign: 'center'}}>Nenhuma despesa encontrada</td>
    </tr>
    )
  )
  return (
    <Card style={styles}>
      <HTMLTable style={tblStyle} bordered condensed interactive striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Tipo de pagamento</th>
            <th>Valor</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            expenses ? expenseRows(expenses) : (
              <tr>
                <td colSpan="6">
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div style={{marginRight: 4}}><Spinner size="20" /></div> Carregando lista...
                  </div>
                </td>
              </tr>
            )
          } 
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" style={{textAlign: 'center'}}> - </td>
          </tr>
        </tfoot>
      </HTMLTable>
      <SysConfirm
        message="Deseja realmente excluir essa despesa?"
        type="primary"
        onClose={(ok) => {
          if (ok) {
            deleteExpense(id);
          }
          setIsOpen(false);
          setId(0);
        }}
        isOpen={isOpen}
      />
    </Card>
  )
};

export default ExpensesList;
