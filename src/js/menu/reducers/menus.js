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
      if (state.size === 1) return state;
      return state.pop();
    }

    case 'REMOVE_MENU': {
      if (state.getIn([-1, 'subMenus']).size) {
        return state.updateIn([-1, 'subMenus'], subMenu => {
          return subMenu.map(curr => menusReducer(curr, action));
        });
      }

      if (parameter.menu) {
        return state.getIn([-1, 'layerName']) === parameter.menu ? state.pop() : state;
      } else {
        return state.pop();
      }
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
  const { columns, commands, categories } = layer;
  const numCommands = commands && commands.length;

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { direction, player } = parameter;

  // Recursion Case, handle submenus.
  if (state.hasIn(['subMenus', player])) {
    // Short Circuit: if the action is to remove a child, prioritize it.
    if (action.type === 'REMOVE_CHILD') {
      return state.deleteIn(['subMenus', player]);
    }

    return state.updateIn(['subMenus', player], subCurrent => menusReducer(subCurrent, action));
  }

  // Detect action types
  switch (action.type) {
    case 'SELECT': {
      if (layer.type === 'categories') {
        return state.update('index', (idx) => {
          const catCommands = categories[state.get('colIndex')].commands.length;
          return (idx + direction + catCommands) % catCommands;
        });
      } else {
        return state.update('index', idx => (idx + direction + numCommands) % numCommands);
      }
    }

    case 'SELECT_COLUMN': {
      if (layer.type === 'categories') {
        // Update the column index, then the row index.
        return state.update('colIndex', (idx) => {
          return (idx + direction + categories.length) % categories.length;
        }).update((newState) => {
          return newState.update('index', (idx) => {
            return Math.min(idx, categories[newState.get('colIndex')].commands.length - 1);
          });
        });
      } else {
        /// Update the index based on the number of columns.
        const mathFn = Math[direction < 0 ? 'ceil' : 'floor'];
        const columnAdjust = mathFn(direction *  numCommands / (columns || 1));
        return state.update('index', idx => (idx + columnAdjust + numCommands) % numCommands);
      }
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
    colIndex: 0,
    subMenus: {},
  });
}
