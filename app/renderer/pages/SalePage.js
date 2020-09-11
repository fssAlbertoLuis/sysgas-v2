import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import AddSaleInfo from '../components/Sale/AddSaleInfo';
import SaleCustomerInfo from '../components/Sale/SaleCustomerInfo';
import InventoryActions from '../redux/actions/InventoryActions';
import ProductService from '../services/ProductService';
import CustomerService from '../services/CustomerService';
import CustomerActions from '../redux/actions/CustomerActions';
import AlertActions from '../redux/actions/AlertActions';
import SalePaymentInfo from '../components/Sale/SalePaymentInfo';
import SaleService from '../services/SaleService';
import SaleActions from '../redux/actions/SaleActions';
import EmployeeActions from '../redux/actions/EmployeeActions';
import EmployeeService from '../services/EmployeeService';
import BaseContainer from '../utils/components/BaseContainer';
import SysConfirm from '../components/alert/SysConfirm';

const styles = {
  margin: '8px',
}

const SalePage = ({
  inventoryState, updateInventoryList,
  customerState, updateCustomersList,
  saleState, updatePaymentMethodList,
  employeeState, updateEmployeesList,
  openAlert,
}) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [resetSale, setResetSale] = useState(false);
  const [sale, setSale] = useState({
    products: [], paymentType: '', customer: null, delivererId: '',
    totalValue: 0, paidValue: 0, changeValue: 0, nf: ''
  });
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    async function getProducts() {
      if (!inventoryState.list) {
        const inventory = await ProductService.getProducts();
        updateInventoryList(inventory);
      }
    }
    getProducts();
  }, []);

  useEffect(() => {
    async function getCustomers() {
      if (!customerState.customersList) {
        const customers = await CustomerService.getCustomers();
        updateCustomersList(customers);
      }
    }
    getCustomers();
  }, []);

  useEffect(() => {
    async function getPaymentMethodList() {
      if (!saleState.paymentMethodList) {
        const paymentMethodList = await SaleService.getPaymentMethodList();
        updatePaymentMethodList(paymentMethodList);
      }
    }
    getPaymentMethodList();
  }, []);

  useEffect(() => {
    async function getEmployees() {
      if (!employeeState.employeeList) {
        const employees = await EmployeeService.getEmployees();
        updateEmployeesList(employees);
      }
    }
    getEmployees();
  }, []);

  const infoProps = {product, setProduct, sale, setSale, resetSale, setResetSale};

  const insertSale = async () => {
    const data = await SaleService.insertSale(sale);
    if (data) {
      const inv = [...inventoryState.list];
      sale.products.map(p => {
        const index = inv.findIndex(i => i.id === p.id);
        inv[index].quantity = p.stock - p.quantity;
      });
      updateInventoryList([...inv]);
      openAlert('success', 'Venda adicionada com sucesso.');
      setResetSale(true);
    } else {
      openAlert('danger', 'Erro ao adicionar nova venda.');
    }
  }
  const send = async () => {
    try {
      const index = sale.products.findIndex(p=>p.quantity > p.stock);
      if (index > -1) {
        setOpenConfirm(true);
      } else {
        insertSale();
      }
    } catch (e) {
      console.log(e);
      openAlert('danger', 'Erro ao adicionar nova venda.');
    }
  }

  return (
    <BaseContainer>
      <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        <div style={{...styles, flex: 2}}>
          <AddSaleInfo {...infoProps}/>
        </div>
        <div style={{...styles, flex: 1, overflow: 'auto'}}>
          <SaleCustomerInfo sale={sale} setSale={setSale} />
          {
            saleState.paymentMethodList && 
            <SalePaymentInfo 
              sale={sale} 
              setSale={setSale}
              sendSale={send}
            />
          }
        </div>
      </div>
      <SysConfirm 
        isOpen={openConfirm}
        message="Um ou mais produtos não tem estoque suficiente, deseja continuar??" 
        type="danger"
        onClose={(ok) => {
          if (ok) {
            insertSale();
          }
          setOpenConfirm(false);
        }}
      />
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  inventoryState: state.inventoryState,
  customerState: state.customerState,
  employeeState: state.employeeState,
  saleState: state.saleState,
});

const mapDispatchToProps = dispatch => ({
  updateInventoryList:
    (items) => dispatch(InventoryActions.updateInventory(items)),
  updateCustomersList:
    (customers) => dispatch(CustomerActions.updateCustomersList(customers)),
  updatePaymentMethodList:
    (paymentMethodList) => dispatch(
      SaleActions.updatePaymentMethodList(paymentMethodList)
    ),
  updateEmployeesList:
      (list) => dispatch(EmployeeActions.updateEmployeesList(list)),
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SalePage);
