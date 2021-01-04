import { combineReducers } from 'redux';
import app from './app';
import user from './user';
import wallet from './wallet';

export default combineReducers({
  app,
  user,
  wallet,
});
