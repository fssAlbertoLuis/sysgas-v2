import React, { useState } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {ipcRenderer} from 'electron';
import BaseContainer from '../utils/components/BaseContainer';
import { Card, Dialog, Icon, Intent } from '@blueprintjs/core';
import ToastActions from '../redux/actions/ToastActions';
import EmployeeActions from '../redux/actions/EmployeeActions';
import SaleActions from '../redux/actions/SaleActions';
import GeneralCreatePageHeader from '../components/generalCreate/GeneralCreatePageHeader';
import GeneralAddForm from '../components/generalCreate/GeneralAddForm';
import BaseTable from '../utils/components/BaseTable';
import EmployeeService from '../services/EmployeeService';
import SaleService from '../services/SaleService';
import GeneralEditForm from '../components/generalCreate/GeneralEditForm';

const tableStyles = {
  margin: 8,
  height: '100%',
  overflow: 'hidden',
  overflowY: 'auto'
};

const GeneralCreatePage = ({
  openToast, 
  employeeState, insertEmployee, updateEmployeesList,
  saleState, insertPaymentMethod, updatePaymentMethodList,
}) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [currentObject, setCurrentObject] = useState(null);

  React.useEffect(() => {
    async function getEmployeesList() {
      if (!employeeState.employeesList) {
        const employees = await EmployeeService.getEmployees();
        updateEmployeesList(employees);
      }
    }
    getEmployeesList();
  }, []);

  React.useEffect(() => {
    async function getPaymentMethodList() {
      if (!saleState.paymentMethodList) {
        const paymentMethods = await SaleService.getPaymentMethodList();
        updatePaymentMethodList(paymentMethods);
      }
    }
    getPaymentMethodList();
  }, []);

  const saveEmployee = async (employee) => {
    if (typeof employee === 'object' && employee.id) {
      const result = ipcRenderer.sendSync('employee:update', employee);
      if (result) {
        const index = employeeState.employeesList.findIndex(e=>e.id===employee.id);
        const list = [...employeeState.employeesList];
        list[index] = {...list[index], name: employee.name};
        updateEmployeesList(list);
        openToast('success', 'Entregador editado.');
      } else {
        openToast('danger', 'Não foi possível editar o entregador.');
      }
    } else {
      const result = await EmployeeService.insertEmployee({name: employee});
      if (result) {console.log(result);
        insertEmployee(result);
        openToast('success', 'Entregador adicionado.');
      } else {
        openToast('danger', 'Entregador existente ou erro ao adicionar.');
      }
    }
  }
  const savePaymentMethod = async (paymentMethod) => {
    if (typeof paymentMethod === 'object' && paymentMethod.id) {
      const result = ipcRenderer.sendSync(
        'sale:updatePaymentMethod', paymentMethod
      );
      if (result) {
        const index = saleState.paymentMethodList.findIndex(p=>p.id===paymentMethod.id);
        const list = [...saleState.paymentMethodList];
        list[index] = {...list[index], paymentMethodName: paymentMethod.paymentMethodName};
        updatePaymentMethodList(list);
        openToast('success', 'Método de pagamento editado.');
      } else {
        openToast('danger', 'Não foi possível editar o método de pag.');
      }
    } else {
      const result = await SaleService.insertPaymentMethod(paymentMethod);
      if (result) {
        insertPaymentMethod({...result, paymentMethodName: paymentMethod});
        openToast('success', 'Método de pagamento adicionado.');
      } else {
        openToast('danger', 'Método de pagamento existente ou erro ao adicionar.');
      }
    }
  }

  return (
    <BaseContainer flexFlow="row">
      <BaseContainer>
        <GeneralCreatePageHeader title="Lista de entregadores" icon="user" />
        <GeneralAddForm
          addTitle="Novo entregador"
          sendFunction={saveEmployee} 
        />
        <Card style={tableStyles}>
          <BaseTable 
            columns={[
              ['name', 'Nome do entregador'],
              ['createdAt', 'Adicionado em', (value) => moment(value).format('DD/MM/YYYY H:mm')],
              ['index', '', (index) => (
                <span>
                  <Icon 
                    style={{margin: 4}} 
                    icon="edit" 
                    intent={Intent.PRIMARY}
                    onClick={() => {
                      setOpenDialog(true);
                      setCurrentObject(employeeState.employeesList[index]);
                    }}
                  />
                </span>
              )],
            ]}
            data={employeeState.employeesList}
          />
        </Card>
      </BaseContainer>
      <Dialog
        style={{padding: 0}}
        className="bp3-dark"
        isOpen={openDialog}
        onClose={() => {
          setCurrentObject(null);
          setOpenDialog(false)
        }}
      >
        <GeneralEditForm
          obj={currentObject}
          editFunction={currentObject && currentObject.paymentMethodName ? 
            savePaymentMethod : 
            saveEmployee
          }
          setOpenDialog={setOpenDialog}
        />
      </Dialog>
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  employeeState: state.employeeState,
  saleState: state.saleState,
});

const mapDispatchToProps = dispatch => ({
  insertEmployee: 
    (employee) => dispatch(EmployeeActions.insertEmployee(employee)),
  updateEmployeesList:
    (employees) => dispatch(EmployeeActions.updateEmployeesList(employees)),
  insertPaymentMethod: 
    (paymentMethod) => dispatch(SaleActions.insertPaymentMethod(paymentMethod)),
  updatePaymentMethodList:
    (paymentMethodList) => dispatch(SaleActions.updatePaymentMethodList(paymentMethodList)),
  openToast: (type, msg) => dispatch(ToastActions.show(type, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralCreatePage);
