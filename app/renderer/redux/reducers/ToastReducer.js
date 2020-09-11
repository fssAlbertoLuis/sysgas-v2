import {Toast} from '../actions/ActionTypes';

const initialState = {
  messages: []
};

export const ToastReducer = (state = initialState, action) => {
  switch (action.type) {
    case Toast.SHOW:
      return {
        ...state, messages: [action.payload, ...state.messages]
      };
    case Toast.UPDATE:
      return {
        ...state,
        messages: [...action.payload],
      };
    default:
      return state;
  }
};
