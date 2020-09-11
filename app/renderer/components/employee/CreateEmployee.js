import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { FormGroup, InputGroup, Card, ControlGroup, Divider, Button, Icon, HTMLSelect } from '@blueprintjs/core';
import EmployeeService from '../../services/EmployeeService';
import LoaderButton from '../../utils/components/LoaderButton';
import AlertActions from '../../redux/actions/AlertActions';
import RoleActions from '../../redux/actions/RoleActions';

const styles = {
  margin: '4px',
}
const CreateEmployee = ({roleState, updateRoleList, openAlert}) => {

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: '', role: ''
  });

  useEffect(() => {
    setRoles(roleState.roleList);
  });

  const resetForm = () => {
    setEmployee({name: '', role: '',});
  }

  const handleChange = (field) => (e) => {
    setEmployee({...employee, [field]: e.target.value});
  }

  const send = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await EmployeeService.insertEmployee(employee);
    if (result) {
      openAlert('success', 'Funcionário adicionado com sucesso!');
      resetForm();
    } else {
      openAlert('danger', 'Funcionário já existe');
    }
    setLoading(false);
  }

  return (
    <Card>
      <h5 className="bp3-heading">
        <span><Icon  icon="user" /> </span>
        Cadastrar novo empregado
      </h5>
      <div className="bp3-text-muted">
        <p>Digite as informações do empregado</p>       
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
              disabled={loading}
              name="employee.name" 
              value={employee.name}
              onChange={handleChange('name')}
              required
            />
          </FormGroup>
          <FormGroup
            helperText=""
            label="Cargo"
            labelFor="select-input"
            style={styles}
          >
            <HTMLSelect 
              options={roles}
              disabled={loading}
              value={employee.role}
              onChange={handleChange('role')}
            />
          </FormGroup>
          <LoaderButton
            type="submit"
            intent="primary"
            style={styles}
            loading={loading}
          >
            Cadastrar
          </LoaderButton>
        </ControlGroup>
      </form>
    </Card>
  );
};

const mapStateToProps = state => ({
  roleState: state.roleState,
});

const mapDispatchToProps = dispatch => ({
  openAlert: (type, msg) => dispatch(AlertActions.open(type, msg)),
  updateRoleList: (roleList) => dispatch(RoleActions.updateList(roleList)), 
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployee);
