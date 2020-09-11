import { Employee } from "./ActionTypes";

const insertEmployee = (employee) => ({
  type: Employee.INSERT,
  payload: employee,
});

const updateEmployeesList = (employeesList) => ({
  type: Employee.UPDATE_LIST,
  payload: employeesList
})

const EmployeeActions = {
  insertEmployee, updateEmployeesList,
};

export default EmployeeActions;
