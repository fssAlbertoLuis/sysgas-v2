import React from 'react';
import {connect} from 'react-redux';
import {Alert} from '@blueprintjs/core';

const SysAlert = ({isOpen, message, type, onClose, theme}) => (
  <Alert className={theme}
    icon={type === 'success' ? 'tick-circle' : 'warning-sign'}
    intent={type === 'success' ? 'success' : 'danger'}
    confirmButtonText="Ok"
    isOpen={isOpen}
    onClose={onClose}
    canEscapeKeyCancel={true}
    canOutsideClickCancel={true}
  ><p>{message}</p></Alert>
);

const mapStateToProps = state => ({
  theme: state.optionsState.theme,
})
export default connect(mapStateToProps, null)(SysAlert);
