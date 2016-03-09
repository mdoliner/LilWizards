/**
 * Created by Justin on 2016-02-29.
 */
import { combineReducers } from 'redux';
import menusReducer from './menus';
import gameReducer from './game';
import characterReducer from './character';

const reducers = {
  menu: menusReducer,
  game: gameReducer,
  character: characterReducer,
};

module.exports = combineReducers(reducers);
