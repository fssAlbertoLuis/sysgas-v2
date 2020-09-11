import { Options } from "../actions/ActionTypes";

const initialState = {
  theme: 'bp3-dark',
};

export const OptionsReducer = (state=initialState, action) => {
  switch(action.type) {
    case Options.THEME_CHANGE:
      return ['bp3-dark', 'bp3'].includes(action.payload) ? {
        ...state, theme: action.payload
      } : {...state, theme: 'dark'};
    default:
      return {...state};
  }
}
