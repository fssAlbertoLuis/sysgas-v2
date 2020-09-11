import {Options} from './ActionTypes';

const changeTheme = (theme) => ({
  type: Options.THEME_CHANGE,
  payload: theme,
});

export default {changeTheme}
