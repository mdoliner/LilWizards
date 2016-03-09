/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';
import menuReducer, { createMenu } from './menu';
import { List } from 'Immutable';

const initialState = List([createMenu('top')]);

export default function menusReducer(state = initialState, action) {
  // Update the current menu
  state = state.update(-1, current => menuReducer(current, action));

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { location, player } = parameter;

  // Detect the action types
  switch (action.type) {
    case 'GO_TO': {
      return state.push(createMenu(location));
    }

    case 'BACK': {
      return state.pop();
    }

    default: {
      return state;
    }
  }
};
