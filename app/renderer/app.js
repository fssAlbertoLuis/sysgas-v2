import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import {Store} from './redux/store';
import OptionsActions from './redux/actions/OptionsActions';
import { ipcRenderer } from 'electron';

const theme = ipcRenderer.sendSync('options:getTheme');
Store.dispatch(OptionsActions.changeTheme(theme));

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.querySelector(document.currentScript.getAttribute('data-container')),
);
