import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {connect} from 'react-redux';
import AppBar from './navbar/AppBar';
import SysAlert from './alert/SysAlert';
import AlertActions from '../redux/actions/AlertActions';
import SalePage from '../pages/SalePage';
import RevenuesPage from '../pages/finances/RevenuesPage';
import ExpensesPage from '../pages/finances/ExpensesPage';
import ToastActions from '../redux/actions/ToastActions';
import SysToast from './toast/SysToast';
import ProductPage from '../pages/ProductPage';
import CustomerPage from '../pages/CustomerPage';
import DeliveryPage from '../pages/DeliveryPage';
import GeneralCreatePage from '../pages/GeneralCreatePage';
import ReportPage from '../pages/ReportPage';
import OptionsPage from '../pages/OptionsPage';
import styles from '../styles';

const App = ({
  optionsState,
  alertState, closeAlert,
  toastState, updateToasts,
}) => {
  const style = styles(optionsState.theme);
  return (
    <div className={optionsState.theme} style={style}>
      <Router>
        <AppBar />
        <Switch>
          <Route path="/sale/create">
            <SalePage />
          </Route>
          <Route path="/finances/revenues">
            <RevenuesPage />
          </Route>
          <Route path="/finances/expenses">
            <ExpensesPage />
          </Route>
          <Route path="/products">
            <ProductPage />
          </Route>
          <Route path="/customers">
            <CustomerPage />
          </Route>
          <Route path="/deliveries">
            <DeliveryPage />
          </Route>
          <Route path="/general-create">
            <GeneralCreatePage />
          </Route>
          <Route path="/report">
            <ReportPage />
          </Route>
          <Route path="/options">
            <OptionsPage />
          </Route>
          <Route path="/">
            <SalePage />
          </Route>
        </Switch>
      </Router>
      <SysAlert 
        isOpen={alertState.isOpen} 
        message={alertState.message}
        onClose={closeAlert}
        type={alertState.type}
      />
      <SysToast
        messages={toastState.messages}
        updateToasts={updateToasts}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  optionsState: state.optionsState,
  alertState: state.alertState,
  toastState: state.toastState,
});

const mapDispatchToProps = dispatch => ({
  closeAlert: () => dispatch(AlertActions.close()),
  updateToasts: (messages) => dispatch(ToastActions.update(messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
