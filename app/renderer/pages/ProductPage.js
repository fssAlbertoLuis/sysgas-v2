import React from 'react';
import {connect} from 'react-redux';
import BaseContainer from '../utils/components/BaseContainer';
import ProductPageHeader from '../components/Product/ProductPageHeader';
import { Dialog } from '@blueprintjs/core';
import CreateProduct from '../components/Product/CreateProduct';
import InventoryActions from '../redux/actions/InventoryActions';
import AlertActions from '../redux/actions/AlertActions';
import ExpenseActions from '../redux/actions/ExpenseActions';
import ExpenseService from '../services/ExpenseService';
import SaleActions from '../redux/actions/SaleActions';
import SaleService from '../services/SaleService';
import ProductService from '../services/ProductService';
import ProductList from '../components/Product/ProductList';
import SearchProductDiv from '../components/Product/SearchProductDiv';
import SysDialog from '../utils/SysDialog';

const ProductPage = ({
  openAlert, insertProductInInventory, insertExpense,
  updatePaymentMethodList, saleState, updateInventoryList,
  inventoryState,
}) => {
  const [product, setProduct] = React.useState({
    name: '', quantity: '', cost: 0, price: 0, paymentType: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [searchCondition, setSearchCondition] = React.useState('');

  React.useEffect(() => {
    async function getPaymentMethodList() {
      if (!saleState.paymentMethodList) {
        const paymentMethodList = await SaleService.getPaymentMethodList();
        updatePaymentMethodList(paymentMethodList);
      }
    }
    getPaymentMethodList();
  }, []);

  React.useEffect(() => {
    async function getProductList() {
      if (!inventoryState.list) {
        const productList = await ProductService.getProducts();
        updateInventoryList(productList);
      }
    }
    getProductList();
  }, []);

  const saveProduct = async (product) => {
    setLoading(true);
    if (product.id) {
      if (product.quantity > 0 && product.cost && product.cost > 0 && product.paymentType) {
        await insertNewExpense(product);
      }
      const p = {
        ...product,
        quantity: product.quantityStock + product.quantity,
        updatedAt: new Date(),
      };
      const result = await ProductService.updateProduct(p);
      if (result) {
        const index = inventoryState.list.findIndex(d => p.id === d.id);
        const ps = inventoryState.list;
        ps[index] = {...p};
        updateInventoryList([...ps]);
        openAlert('success', 'Produto editado com sucesso!');
        resetForm();
      } else {
        openAlert('danger', 'Erro ao editar produto.');
      }
    } else {
      if (product.cost && product.cost > 0 && product.paymentType) {
        await insertNewExpense(product);
      }
      const result = await ProductService.insertProduct(product);
      if (result) {
        insertProductInInventory(result);
        openAlert('success', 'Produto adicionado com sucesso!');
        resetForm();
      } else {
        openAlert('danger', 'Produto já existe.');
      }
    }
    setLoading(false);
    setOpenDialog(false);
  }

  const deleteProduct = async (index) => {
    const p = inventoryState.list;
    const result = await ProductService.deleteProduct(p[index].id);
    if (result) {
      p.splice(index, 1);
      updateInventoryList([...p]); 
      openAlert('success', 'Produto deletado');
    } else { 
      openAlert('danger', 'Erro ao deletera produto');
    }
  }

  const insertNewExpense = async (product) => {
    const operation = product.id ? 'Reestoque':'Compra';
    const expense = {
      description: `${operation}: ${product.quantity} unidade(s) de ${product.name}`,
      paymentType: product.paymentType,
      value: Number(product.quantity * product.cost).toFixed(2)
    };
    insertExpense(expense);
    await ExpenseService.insertExpense(expense);
  } 

  const filterProducts = (search) => {
    if (search != searchCondition) {
      setSearchCondition(search);
    }
  }
  const resetForm = () => {
    setProduct({
      name: '', quantity: '', cost: 0, price: 0, paymentType: ''
    });
  }
  return (
    <BaseContainer>
      <ProductPageHeader openDialog={setOpenDialog} />
      <SearchProductDiv filterProducts={filterProducts} />
      <ProductList
        setOpenDialog={setOpenDialog}
        setProduct={setProduct}
        products={inventoryState.list && inventoryState.list.filter(
          p => searchCondition === '' || 
          p.name.toLowerCase().indexOf(searchCondition.toLowerCase()) >= 0
        )}
        deleteProduct={deleteProduct}
      />
      <SysDialog
        style={{padding: 0}}
        isOpen={openDialog}
        onClose={() => {
          resetForm();
          setOpenDialog(false)
        }}
      >
        <CreateProduct 
          product={product} setProduct={setProduct}
          saveProduct={saveProduct}
          paymentTypes={saleState.paymentMethodList ? saleState.paymentMethodList : ['']}
          loading={loading}
        />
      </SysDialog>
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  saleState: state.saleState,
  inventoryState: state.inventoryState,
});

const mapDispatchToProps = dispatch => ({
  insertProductInInventory: 
    (product) => dispatch(InventoryActions.insertItem(product)),
  updateInventoryList:
    (items) => dispatch(InventoryActions.updateInventory(items)),
  insertExpense: 
    (expense) => dispatch(ExpenseActions.insertExpense(expense)),
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
  updatePaymentMethodList:
    (paymentMethodList) => dispatch(
      SaleActions.updatePaymentMethodList(paymentMethodList)
    ),

});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
