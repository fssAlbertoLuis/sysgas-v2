import React from 'react';
import {connect} from 'react-redux';
import OptionsActions from '../../redux/actions/OptionsActions';
import { Card, RadioGroup, Radio } from '@blueprintjs/core';
import {ipcRenderer} from 'electron';

const styles = {
  margin: 8,
};

const mapStateToProps = state => ({
  optionsState: state.optionsState,
});

const mapDispatchToProps = dispatch => ({
  changeTheme: (theme) => dispatch(OptionsActions.changeTheme(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ({optionsState, changeTheme}) => (
    <Card style={styles}>
      <RadioGroup
        label="Tema da aplicação"
        onChange={(e) => {
          changeTheme(e.target.value);
          ipcRenderer.sendSync('options:changeTheme', e.target.value);
        }}
        selectedValue={optionsState.theme}
        inline
      >
        <Radio label="Escuro" value="bp3-dark" large />
        <Radio label="Claro" value="bp3" large />
      </RadioGroup>
    </Card>
  )
);
