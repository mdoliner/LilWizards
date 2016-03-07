/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';

const initialState = [createMenu('top')];

export default function menuReducer(state = initialState, action) {
  // Ensure that state is mutable
  state = _.cloneDeep(state);

  // Resolve the state
  const current = _.last(state);
  const menu = getLayer(current.layer);
  const { columns, commands } = menu;
  const numCommands = commands && commands.length;

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { direction, location, player } = parameter;

  // Detect the action types
  switch (action.type) {
    case 'SELECT': {
      current.index = (current.index + direction + numCommands) % numCommands;

      console.log('selected:', commands[current.index].name);

      return state;
    }

    case 'SELECT_COLUMN': {
      const mathFn = Math[direction < 0 ? 'ceil' : 'floor'];
      const columnAdjust = mathFn(direction *  numCommands / (columns || 1));
      current.index = (current.index + columnAdjust + numCommands) % numCommands;

      console.log('selected:', commands[current.index].name);

      return state;
    }

    case 'GO_TO': {
      state.push(createMenu(location));

      console.log('went to:', location);

      return state;
    }

    case 'ADD_CHILD': {
      if (_.size(current.subMenus) > 3) {
        console.log('too many children');
        return state;
      }

      current.subMenus[player] = [createMenu(menu.subMenus)];

      console.log('add child:', player);

      return state;
    }

    case 'BACK': {
      if (state.length > 1) state.pop();

      console.log('went back');

      return state;
    }

    default: {
      return state;
    }
  }
};

function createMenu(location) {
  return {
    layer: location,
    index: 0,
    subMenus: {},
  };
}
