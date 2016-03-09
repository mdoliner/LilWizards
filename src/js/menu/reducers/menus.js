/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';
import menuReducer, { createMenu } from './menu';

const initialState = [createMenu('top')];

export default function menusReducer(state = initialState, action) {
  // Resolve the state
  const current = _.last(state);
  const newCurrent = menuReducer(current, action);

  if (current !== newCurrent) {
    state = _.dropRight(state).concat(newCurrent);
  }

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { location, player } = parameter;

  // Detect the action types
  switch (action.type) {
    case 'GO_TO': {
      state = state.concat(createMenu(location));

      return state;
    }

    case 'BACK': {
      if (state.length > 1) state = _.dropRight(state);

      return state;
    }

    default: {
      return state;
    }
  }
};
