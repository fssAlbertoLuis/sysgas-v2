import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import ExpenseForm from '../../components/finances/expenses/ExpenseForm';
import ExpensesList from '../../components/finances/expenses/ExpensesList';
import SaleService from '../../services/SaleService';
import SaleActions from '../../redux/actions/SaleActions';
import ExpenseService from '../../services/ExpenseService';
import ExpenseActions from '../../redux/actions/ExpenseActions';
import BaseContainer from '../../utils/components/BaseContainer';
import DateFilter from '../../utils/components/DateFilter';
import ToastActions from '../../redux/actions/ToastActions';

const ExpensesPage = ({
  saleState, updatePaymentMethodList, showToast,
  expenseState, insertExpense, updateExpenseList,
}) => {

  const [filterDate, setFilterDate] = useState(new Date());

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
    async function getList() {
      const data = await ExpenseService.getExpenseList();
      updateExpenseList(data);
    }
    getList();
  }, []);

  const sendExpense = async (expense) => {
    try {
      const result = await ExpenseService.insertExpense(expense);
      if (result) {
        insertExpense(result);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  const deleteExpense = (index) => {
    const expenseList = expenseState.expenseList;
    const result = ExpenseService.deleteExpense(expenseList[index].id);
    if (result) {
      expenseList.splice(index, 1);
      updateExpenseList(expenseList);
      showToast('success', 'Despesa deletada');
    } else {
      showToast('danger', 'Erro ao deletar despesa');
    }

  }

  const changeExpenseDay = async (date) => {
    setFilterDate(date);
    updateExpenseList(null);
    const data = await ExpenseService.getExpenseList(date);
    updateExpenseList(data);
  }

  return (
    !saleState.paymentMethodList ? 'Carregando...' :
    <BaseContainer>
      <ExpenseForm
        filterDate={filterDate}
        sendExpense={sendExpense}
        paymentTypeList={saleState.paymentMethodList}
      />
      <DateFilter 
        changeDate={changeExpenseDay}
        resetFunction={() => changeExpenseDay(new Date())}
      />
      <ExpensesList 
        expenses={expenseState.expenseList}
        deleteExpense={deleteExpense}
       />
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  saleState: state.saleState,
  expenseState: state.expenseState,
});

const mapDispatchToProps = dispatch => ({
  updatePaymentMethodList:
    (paymentMethodList) => dispatch(
      SaleActions.updatePaymentMethodList(paymentMethodList)
    ),
  insertExpense:
    (expense) => dispatch(
      ExpenseActions.insertExpense(expense)
    ),
  updateExpenseList:
    (list) => dispatch(
      ExpenseActions.updateExpense(list)
    ),
    updateExpenseList:
    (list) => dispatch(
      ExpenseActions.updateExpense(list)
    ),
  showToast: (intent, message) => dispatch(ToastActions.show(intent, message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesPage);
