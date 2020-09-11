import React from 'react';
import {connect} from 'react-redux';
import {ipcRenderer} from 'electron';
import BaseContainer from '../utils/components/BaseContainer';
import { Dialog } from '@blueprintjs/core';
import CustomerActions from '../redux/actions/CustomerActions';
import AlertActions from '../redux/actions/AlertActions';
import CustomerService from '../services/CustomerService';
import SearchCustomerDiv from '../components/customer/SearchCustomerDiv';
import CustomersList from '../components/customer/CustomersList';
import CreateCustomer from '../components/customer/CreateCustomer';
import CustomerPageHeader from '../components/customer/CustomerPageHeader';
import SysDialog from '../utils/SysDialog';

const CustomerPage = ({
  openAlert, insertCustomer, updateCustomersList, customerState,
}) => {

  const [customer, setCustomer] = React.useState({
    name: '', type: '', phone: '', address: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [searchCondition, setSearchCondition] = React.useState('');

  React.useEffect(() => {
    async function getCustomersList() {
      if (!customerState.customersList) {
        const customersList = await CustomerService.getCustomers();
        updateCustomersList(customersList);
      }
    }
    getCustomersList();
  }, []);

  const saveCustomer = async (customer) => {
    setLoading(true);
    if (customer.id) {
        const result = ipcRenderer.sendSync('customer:update', customer);
        if (result) {
          const index = customerState.customersList.findIndex(
            c => c.id === result.id
          );
          const customersList = customerState.customersList;
          customersList[index] = {...result};
          updateCustomersList([...customersList]);
          openAlert('success', 'Cliente editado com sucesso!');
        } else {
          openAlert('danger', 'Não foi possível editar o cliente');
        }
        setLoading(false);
        setOpenDialog(false);
        resetForm();
    } else {
      const result = ipcRenderer.sendSync('customer:insert', customer);
      if (result) {
        insertCustomer(result);
        openAlert('success', 'Cliente adicionado com sucesso!');
        resetForm();
      } else {
        openAlert('danger', 'Não foi possível adicionar o cliente.');
      }
      setLoading(false);
      setOpenDialog(false);
    }
  }

  const filterCustomers = (search) => {
    if (search != searchCondition) {
      setSearchCondition(search);
    }
  }

  const resetForm = () => {
    setCustomer({
      name: '', type: '', phone: '', address: '',
    });
  }
  return (
    <BaseContainer>
      <CustomerPageHeader openDialog={setOpenDialog} />
      <SearchCustomerDiv filterCustomers={filterCustomers} />
      <CustomersList
        setOpenDialog={setOpenDialog}
        setCustomer={setCustomer}
        customers={customerState.customersList && customerState.customersList.filter(
          c => searchCondition === '' || 
          c.name.toLowerCase().indexOf(searchCondition.toLowerCase()) >= 0
        )}
      />
      <SysDialog
        style={{padding: 0}}
        isOpen={openDialog}
        onClose={() => {
          resetForm();
          setOpenDialog(false)
        }}
      >
        <CreateCustomer 
          saveCustomer={saveCustomer} 
          loading={loading} 
          customer={customer}
          setCustomer={setCustomer}
        />
      </SysDialog>
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  customerState: state.customerState,
});

const mapDispatchToProps = dispatch => ({
  insertCustomer: 
    (customer) => dispatch(CustomerActions.insertCustomer(customer)),
    updateCustomersList:
    (customers) => dispatch(CustomerActions.updateCustomersList(customers)),
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);
