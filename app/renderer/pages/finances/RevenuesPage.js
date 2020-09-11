import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import BaseContainer from '../../utils/components/BaseContainer';
import RevenueForm from '../../components/finances/revenues/RevenueForm';
import SaleService from '../../services/SaleService';
import SaleActions from '../../redux/actions/SaleActions';
import RevenueService from '../../services/RevenueService';
import RevenueActions from '../../redux/actions/RevenueActions';
import RevenuesList from '../../components/finances/revenues/RevenuesList';
import DateFilter from '../../utils/components/DateFilter';
import ToastActions from '../../redux/actions/ToastActions';


const RevenuesPage = ({
  saleState, updatePaymentMethodList, insertRevenue,
  revenueState, updateRevenueList, showToast,
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
      const data = await RevenueService.getRevenueList();
      updateRevenueList(data);
    }
    getList();
  }, []);

  const deleteRevenue = (index) => {
    const revenueList = revenueState.revenueList;
    const result = RevenueService.deleteRevenue(revenueList[index].id);
    if (result) {
      revenueList.splice(index, 1);
      updateRevenueList(revenueList);
      showToast('success', 'Recebimento deletado');
    } else {
      showToast('danger', 'Não foi possível deletar recebimento');
    }
  }

  const changeRevenueDay = async (date) => {
    setFilterDate(date);
    updateRevenueList(null);
    const data = await RevenueService.getRevenueList(date);
    updateRevenueList(data);
  }

  const sendRevenue = async (revenue) => {
    try {
      const result = await RevenueService.insertRevenue(revenue);
      if (result) {
        insertRevenue(result);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  return (
    !saleState.paymentMethodList ? 'Carregando...' :
    <BaseContainer>
      <RevenueForm
        filterDate={filterDate}
        sendRevenue={sendRevenue}
        paymentTypeList={saleState.paymentMethodList}
      />
      <DateFilter 
        changeDate={changeRevenueDay}
        resetFunction={() => changeRevenueDay(new Date())}
      />
      <RevenuesList 
        revenues={revenueState.revenueList} 
        deleteRevenue={deleteRevenue}
      />
    </BaseContainer>
  );
}

const mapStateToProps = state => ({
  saleState: state.saleState,
  revenueState: state.revenueState,
});

const mapDispatchToProps = dispatch => ({
  showToast: (intent, message) => dispatch(ToastActions.show(intent, message)),
  updatePaymentMethodList: (list) => 
    dispatch(SaleActions.updatePaymentMethodList(list)),
  insertRevenue: (revenue) =>
    dispatch(RevenueActions.insertRevenue(revenue)),
  updateRevenueList: (list) =>
    dispatch(RevenueActions.updateRevenuesList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(RevenuesPage);
