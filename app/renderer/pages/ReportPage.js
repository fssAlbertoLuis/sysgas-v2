import React, { useEffect, useState } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import BaseContainer from '../utils/components/BaseContainer';
import ReportPageReader from '../components/Report/ReportPageHeader';
import RevenueReport from '../components/Report/RevenueReport';
import ExpenseReport from '../components/Report/ExpenseReport';
import GeneralReport from '../components/Report/GeneralReport';
import RevenueActions from '../redux/actions/RevenueActions';
import ExpenseActions from '../redux/actions/ExpenseActions';
import RevenueService from '../services/RevenueService';
import ExpenseService from '../services/ExpenseService';
import DateFilter from '../utils/components/DateFilter';
import { Button, Intent } from '@blueprintjs/core';
import SysConfirm from '../components/alert/SysConfirm';
import { ipcRenderer } from 'electron';
import AlertActions from '../redux/actions/AlertActions';

const style = {
  margin: 8
}

const ReportPage = ({ showAlert,
  revenueState, updateRevenueList,
  expenseState, updateExpenseList,
}) => {

  const [generalReport, setGeneralReport] = useState({
    expenses: {cash: 0, card: 0}, revenues: {cash: 0, card: 0}
  });

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('day');
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    async function update() {
      const list = await RevenueService.getRevenueList(date, mode);
      updateRevenueList(list);
    }
    update();
  }, [date]);

  useEffect(() => {
    async function update() {
      const list = await ExpenseService.getExpenseList(date, mode);
      updateExpenseList(list);
    }
    update();
  }, [date]);

  useEffect(() => {
    async function update() {
      let list = await RevenueService.getRevenueList(date, mode);
      updateRevenueList(list);
      list = await ExpenseService.getExpenseList(date, mode);
      updateExpenseList(list);
    }
    setFilterTitle(getFilterTitle(date));
    update();
  }, [mode]);

  useEffect(() => {
    if (expenseState.expenseList && revenueState.revenueList) {
      const expenses = expenseState.expenseList;
      const revenues = revenueState.revenueList;
      setGeneralReport({
        expenses: {
          cash: expenses.reduce(
            (sum, expense) =>
            expense.paymentType === 'dinheiro' ? sum+expense.value:sum+0
          , 0),
          card: expenses.reduce(
            (sum, expense) => 
            expense.paymentType === 'cartão' ? sum+expense.value:sum+0
          , 0),
        },
        revenues: {
          cash: revenues.reduce(
            (sum, revenue) =>
              revenue.paymentType === 'dinheiro' ? sum+revenue.value:sum+0
          , 0),
          card: revenues.reduce(
            (sum, revenue) => 
              revenue.paymentType === 'cartão' ? sum+revenue.value:sum+0
          , 0),
        }
      })
    }
  }, [expenseState.expenseList, revenueState.revenueList]);

  const filterDate = (date) => {
    setFilterTitle(getFilterTitle(date));
    setDate(date);
  }

  function getFilterTitle(date) {
    if (['year', 'month'].includes(mode)) {
      const d = moment(date);
      if (mode === 'year') return d.year();
      else if (mode === 'month') return `${d.format('MMMM, YYYY')}`;
    } else {
      const today = moment().isSame(moment(date), 'day');
      const yesterday = moment().subtract(1, 'day').isSame(moment(date), 'day');
      if (today) {
        return 'Hoje';
      } else if (yesterday) {
        return 'Ontem';
      } else {
        return moment(date).format('DD/MM/YYYY');
      }
    }
  }

  const resetFilters = () => {
    setDate(new Date());
    setMode('day');
  }
  const [filterTitle, setFilterTitle] = useState(getFilterTitle(new Date()));

  const generateReportSpreadsheet = () => {
    const response = ipcRenderer.sendSync('report:spreadsheet', date, mode);
    if (response && response.result) {
      showAlert('success', response.msg);
    } else {
      let msg = 'Relatório não criado.';
      if (response.error && typeof response.error ===  'object') {
        if (response.error.code === 'EBUSY') {
          msg += ' O arquivo já está aberto em algum programa';
        }
      }
      showAlert('danger', msg);
    }
  }
  return (
    <BaseContainer>
      <ReportPageReader 
        filterTitle={filterTitle} 
        setOpenConfirm={setOpenConfirm}
      />
      <DateFilter 
        changeDate={filterDate}
        resetFunction={resetFilters}
        additionalFilters={
          <span style={{marginLeft: 8}}>
            Filtrar por:
            <Button 
              intent={mode === 'day' ? Intent.SUCCESS : Intent.NONE} 
              text="Dia" 
              style={{marginLeft: 5}}
              onClick={() => setMode('day')}
            />
            <Button 
              intent={mode === 'month' ? Intent.SUCCESS : Intent.NONE} 
              text="Mês" 
              style={{marginLeft: 5}}
              onClick={() => setMode('month')}
            />
            <Button 
              intent={mode === 'year' ? Intent.SUCCESS : Intent.NONE} 
              text="Ano" 
              style={{marginLeft: 5}}
              onClick={() => setMode('year')}
            />
          </span>
        }
      />
      <div style={{display: 'flex'}}>
        <RevenueReport 
          filterName={filterTitle} 
          revenueReport={generalReport.revenues} 
        />
        <ExpenseReport 
          filterName={filterTitle} 
          expenseReport={generalReport.expenses}
        />
        <GeneralReport
          filterName={filterTitle} 
          generalReport={generalReport} 
        />
      </div>
      <SysConfirm
        isOpen={openConfirm}
        message={`Imprimir relatório: ${filterTitle}?`}
        type="primary"
        onClose={(ok) => {
          if (ok) {
            generateReportSpreadsheet();
          }
          setOpenConfirm(false);
        }}
      />
    </BaseContainer>
  )
}

const mapStateToProps = state => ({
  revenueState: state.revenueState,
  expenseState: state.expenseState,
});

const mapDispatchToProps = dispatch => ({
  updateRevenueList: list => dispatch(RevenueActions.updateRevenuesList(list)),
  updateExpenseList: list => dispatch(ExpenseActions.updateExpense(list)),
  showAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);
