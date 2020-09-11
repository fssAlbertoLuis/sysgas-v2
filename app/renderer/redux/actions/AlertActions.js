import { Alert } from "./ActionTypes"

const open = (type, message) => {
  return {
    type: Alert.OPEN,
    payload: {
      type, message
    }
  }
}

const close = () => {
  return {
    type: Alert.CLOSE,
  }
}

const AlertActions = {open, close}

export default AlertActions;
