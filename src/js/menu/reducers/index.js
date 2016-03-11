/**
 * Created by Justin on 2016-02-29.
 */
import { combineReducers } from 'redux';
import menusReducer from './menus';
import gameReducer from './game';
import charactersReducer from './characters';

const reducers = {
  menu: menusReducer,
  game: gameReducer,
  characters: charactersReducer,
};

module.exports = combineReducers(reducers);
