import React, {useState} from 'react';
import { Card, HTMLTable, Icon, Spinner, Intent, Dialog } from '@blueprintjs/core';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import SysConfirm from '../../alert/SysConfirm';
import ViewSale from '../../Sale/ViewSale';

const styles = {
  height: '100%',
  overflow: 'hidden',
  margin: 8,
  overflowY: 'auto',
};

const tblStyle = {
  width: '100%',
}

const RevenuesList = ({deleteRevenue, revenues}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState(0);

  const revenuesRows = (list) => (
    list.length ? (
      list.map((revenue, index) => (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{revenue.description}</td>
          <td>{revenue.paymentType}</td>
          <td>
            <CurrencyFormat 
              value={revenue.value}
              displayType="text"
              thousandSeparator={true}
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              fixedDecimalScale
              prefix={'R$'}
            />
          </td>
          <td>{moment(revenue.createdAt).format('DD/MM/YYYY H:mm')}</td>
          <td style={{textAlign: 'center'}}>
            <span>
              {
                revenue.Sale &&
                <Icon 
                  style={{margin: 4}} 
                  icon="search" 
                  intent={Intent.PRIMARY}
                  onClick={() => {
                    setId(index);
                    setOpenDialog(true);
                  }}
                />
              }
              <Icon 
                style={{margin: 4}} 
                intent={Intent.DANGER} icon="trash" onClick={() => {
                setId(index);
                setIsOpen(true);
              }}/>
            </span>
          </td>
        </tr>
      ))
    ) : (
    <tr>
      <td colSpan="6" style={{textAlign: 'center'}}>Nenhuma receita encontrada</td>
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
            revenues ? revenuesRows(revenues) : (
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
        message="Deseja realmente excluir essa receita?"
        type="primary"
        onClose={(ok) => {
          if (ok) {
            deleteRevenue(id);
          }
          setIsOpen(false);
          setId(0);
        }}
        isOpen={isOpen}
      />
      {
        revenues && revenues.length ?
        <Dialog
          style={{padding: 0}}
          className="bp3-dark"
          isOpen={openDialog}
          onClose={() => {
            setOpenDialog(false)
          }}
        >
          <ViewSale sale={revenues[id].Sale} setOpenDialog={setOpenDialog} />
        </Dialog> : ''
      }
    </Card>
  )
};

export default RevenuesList;
