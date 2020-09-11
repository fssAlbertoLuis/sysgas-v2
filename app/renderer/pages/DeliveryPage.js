import React, {useState} from 'react';
import {ipcRenderer} from 'electron';
import {connect} from 'react-redux';
import BaseContainer from '../utils/components/BaseContainer';
import AlertActions from '../redux/actions/AlertActions';
import DateFilter from '../utils/components/DateFilter';
import DeliveryPageHeader from '../components/Sale/DeliveryPageHeader';
import DeliveriesList from '../components/Sale/DeliveriesList';
import { Button, Intent } from '@blueprintjs/core';

const DeliveryPage = () => {

  const [mode, setMode] = useState('geral');
  const [deliveries, setDeliveries] = React.useState(null);
  const [filterDate, setFilterDate] = useState(new Date());

  React.useEffect(() => {
    async function getPaymentMethodList() {
      const data = ipcRenderer.sendSync('revenue:saleWithDelivery', new Date());
      if (data) {
        setDeliveries(data);
      }
    }
    getPaymentMethodList();
  }, []);

  const changeDeliveryDay = async (date) => {
    setMode('geral');
    setFilterDate(date);
    setDeliveries(null);
    const data = await ipcRenderer.sendSync(
      'revenue:saleWithDelivery', date
    );
    setDeliveries(data);
  }

  const markAsDelivered = (id) => {
    const result = ipcRenderer.sendSync('sale:markAsDelivered', id);
    if (result) {
      const index = deliveries.findIndex(d => d.Sale.id === id);
      const delivery = {...deliveries[index]};
      delivery.Sale.delivered = true;
      const copyDeliveries = [...deliveries];
      copyDeliveries[index] = delivery;
      setDeliveries([...copyDeliveries.sort(
        (a,b) => {
          if (a.Sale.delivered > b.Sale.delivered) {
            return 1;
          }
          if (a.Sale.delivered < b.Sale.delivered) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
      ]);
    } else {
      AlertActions.open('DANGER', 'Não foi possível marcar a venda como entregue');
    }
  }

  return (
    <BaseContainer>
      <DeliveryPageHeader mode={mode} />
      <DateFilter 
        changeDate={changeDeliveryDay}
        resetFunction={() => changeDeliveryDay(new Date())}
        additionalFilters={(
          <span style={{marginLeft: 8}}>
            Filtrar por:
            <Button 
              intent={mode === 'geral' ? Intent.SUCCESS : Intent.NONE} 
              text="Geral" 
              style={{marginLeft: 5}}
              onClick={() => setMode('geral')}
            />
            <Button 
              intent={mode === 'cliente' ? Intent.SUCCESS : Intent.NONE} 
              text="Cliente" 
              style={{marginLeft: 5}}
              onClick={() => setMode('cliente')}
            />
            <Button 
              intent={mode === 'empresa' ? Intent.SUCCESS : Intent.NONE} 
              text="Empresa" 
              style={{marginLeft: 5}}
              onClick={() => setMode('empresa')}
            />
          </span>
        )}
      />
      <DeliveriesList 
        deliveries={deliveries && deliveries.filter(
          d => mode === 'geral' || d.Sale.Customer.type === mode
        )} 
        markAsDelivered={markAsDelivered}
      />
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  saleState: state.saleState,
  inventoryState: state.inventoryState,
});

const mapDispatchToProps = dispatch => ({
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryPage);
