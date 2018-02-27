import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import settings from './Settings';

export default combineReducers({
  settings,
  router: routerReducer,
});
