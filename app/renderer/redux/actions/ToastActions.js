import { Toast } from "./ActionTypes"

const show = (type, message) => {
  return {
    type: Toast.SHOW,
    payload: {
      type, message
    }
  }
}

const update = (toasts) => {
  return {
    type: Toast.UPDATE,
    payload: toasts
  }
}

const ToastActions = {show, update}

export default ToastActions;
