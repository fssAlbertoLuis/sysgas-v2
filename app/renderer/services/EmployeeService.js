
import {ipcRenderer} from 'electron';

const getRoles = async () => {
  const data = ipcRenderer.sendSync('get-model', 'Role', 'findAll', {attributes: ['roleName']});
  return data.map(d => d.dataValues.roleName)
};

const insertEmployee = async ({name}) => {
  try {
    const data = ipcRenderer.sendSync('get-model', 'Employee', 'findOne', {where: {name}});
    if (data) {
      return false;
    } else {
      const data = await ipcRenderer.sendSync('get-model', 'Employee', 'create', {name});
      return data ? data.dataValues : null;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getEmployees = async () => {
  try {
    const data = ipcRenderer.sendSync('get-model', 'Employee', 'findAll', {attributes: ['id','name', 'createdAt']});
    return data ? data.map(d => d.dataValues) : [];
  } catch (err) {
    console.log(err);
    return false;
  }
}

const EmployeeService = {
  getRoles, insertEmployee, getEmployees
}

export default EmployeeService;
