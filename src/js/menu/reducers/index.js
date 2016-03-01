/**
 * Created by Justin on 2016-02-29.
 */
import { combineReducers } from 'redux';
import menuReducer from './menu';

const reducers = {
  menu: menuReducer,
};

module.exports = combineReducers(reducers);
