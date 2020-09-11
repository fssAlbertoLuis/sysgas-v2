import React from 'react';
import {connect} from 'react-redux';
import {Alert, Intent} from '@blueprintjs/core';

const determineIcon = (intent) => {
  switch(intent) {
    case Intent.SUCCESS:
      return 'tick-circle';
    case Intent.DANGER:
      return 'warning-sign'
    default:
      return 'help';
  }
}

const SysConfirm = ({isOpen, message, type, onClose, theme}) => (
  <Alert className={theme}
    icon={determineIcon(type)}
    intent={type}
    confirmButtonText="Sim"
    isOpen={isOpen}
    onClose={onClose}
    canEscapeKeyCancel={true}
    canOutsideClickCancel={true}
    cancelButtonText="Não"
  ><p>{message}</p></Alert>
);

const mapStateToProps = state => ({
  theme: state.optionsState.theme,
})
export default connect(mapStateToProps, null)(SysConfirm);
