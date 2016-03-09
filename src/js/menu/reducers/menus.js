/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';
import { List, fromJS } from 'immutable';

const initialState = List([createMenu('top')]);

/**
 * Reduces multiple menus.
 * @param state
 * @param action
 * @returns {*}
 */
export default function menusReducer(state = initialState, action) {
  // Update the current menu
  state = state.update(-1, current => menuReducer(current, action));

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { location, player } = parameter;

  if (state.hasIn([-1, 'subMenus', player])) {
    return state;
  }

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

/**
 * Reduces a single menu.
 * @param state
 * @param action
 * @returns {*}
 */
function menuReducer(state, action) {
  const layer = getLayer(state.get('layerName'));
  const { columns, commands } = layer;
  const numCommands = commands && commands.length;

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { direction, player } = parameter;

  if (state.hasIn(['subMenus', player])) {
    return state.updateIn(['subMenus', player], subCurrent => menusReducer(subCurrent, action));
  }

  // Detect action types
  switch (action.type) {
    case 'SELECT': {
      return state.update('index', idx => (idx + direction + numCommands) % numCommands);
    }

    case 'SELECT_COLUMN': {
      const mathFn = Math[direction < 0 ? 'ceil' : 'floor'];
      const columnAdjust = mathFn(direction *  numCommands / (columns || 1));
      return state.update('index', idx => (idx + columnAdjust + numCommands) % numCommands);
    }

    case 'ADD_CHILD': {
      if (state.get('subMenus').size > 3) {
        console.log('too many children');
        return state;
      }

      return state.setIn(['subMenus', player], List([createMenu(layer.subMenuEntry)]));
    }

    default: {
      return state;
    }
  }
}

/**
 * Helper function.
 * @param location
 * @returns {*}
 */
function createMenu(location) {
  return fromJS({
    layerName: location,
    index: 0,
    subMenus: {},
  });
}
