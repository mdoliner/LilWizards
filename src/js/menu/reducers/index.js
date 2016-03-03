/**
 * Created by Justin on 2016-02-29.
 */
import { combineReducers } from 'redux';
import menuReducer from './menu';
import gameReducer from './game';
import characterReducer from './character';

const reducers = {
  menu: menuReducer,
  game: gameReducer,
  character: characterReducer,
};

module.exports = combineReducers(reducers);
