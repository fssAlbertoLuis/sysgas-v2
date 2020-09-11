import React from 'react';
import {connect} from 'react-redux';
import { Dialog } from '@blueprintjs/core';


const mapStateToProps = state => ({
  theme: state.optionsState.theme,
})
export default connect(mapStateToProps, null)(
  ({children, theme, ...props}) => (
    <Dialog className={theme} {...props}>
      {children}
    </Dialog>
  )
);
