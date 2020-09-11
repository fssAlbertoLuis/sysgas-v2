import React, {useState} from 'react';
import {connect} from 'react-redux';
import { 
  FormGroup, 
  InputGroup, 
  Card, 
  ControlGroup, 
  Divider, 
  Button, 
  Icon,
  Spinner
} from '@blueprintjs/core';
import RoleService from '../../services/RoleService';
import SysAlert from '../alert/SysAlert';
import AlertActions from '../../redux/actions/AlertActions';
import RoleActions from '../../redux/actions/RoleActions';

const styles = {
  margin: '4px',
}
const CreateRole = ({insertNewRole, openAlert}) => {

  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setRoleName('');
  }

  const handleChange = (e) => {
    setRoleName(e.target.value);
  }

  const send = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await RoleService.insertRole(roleName);
    if (result) {
      openAlert('success', 'Cargo adicionado com sucesso!');
      insertNewRole(roleName);
      resetForm();
    } else {
      openAlert('danger', 'Esse cargo já existe');
    }
    setLoading(false);
  }

  return (
    <Card>
      <h5 className="bp3-heading">
        <span><Icon  icon="user" /> </span>
        Cadastrar novo cargo
      </h5>
      <div className="bp3-text-muted">
        <p>Digite as informações do cargo</p>       
      </div>
      <Divider />
      <form onSubmit={send}>
        <ControlGroup style={{alignItems: 'flex-end'}}>
          <FormGroup
            helperText=""
            label="Nome"
            labelFor="text-input"
            style={styles}
          >
            <InputGroup 
              type="text" 
              name="roleName" 
              disabled={loading}
              value={roleName}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <Button 
            type="submit" 
            intent="primary"
            disabled={loading}
            icon={loading ? <Spinner size={Spinner.SIZE_SMALL} /> : 'play'} 
            style={styles}
          >{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        </ControlGroup>
      </form>
    </Card>
  );
};

const mapDispatchToProps = dispatch => ({
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
  insertNewRole: (role) => dispatch(RoleActions.insertRole(role)),
});

export default connect(null, mapDispatchToProps)(CreateRole);
