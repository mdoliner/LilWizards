/**
 * Created by Justin on 2016-02-29.
 */
import { combineReducers } from 'redux';
import menuReducer from './menu';
import gameReducer from './game';

const reducers = {
  menu: menuReducer,
  game: gameReducer,
};

module.exports = combineReducers(reducers);
