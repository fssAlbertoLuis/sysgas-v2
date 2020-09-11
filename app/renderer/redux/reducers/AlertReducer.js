import {Alert} from '../actions/ActionTypes';

const initialState = {
  isOpen: false,
  message: ''
};

export const AlertReducer = (state = initialState, action) => {
  switch (action.type) {
    case Alert.OPEN:
      return {
        ...state,
        isOpen: true,
        type: action.payload.type,
        message: action.payload.message,
      };
    case Alert.CLOSE:
      return {
        ...state,
        isOpen: false,
        message: '',
      };
    default:
      return state;
  }
};