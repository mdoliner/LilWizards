/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';

const initialState = [createMenu('top')];

export default function menuReducer(state = initialState, action) {
  state = _.cloneDeep(state);
  const current = _.last(state);
  const menu = getLayer(current.layer);
  const { columns, commands } = menu;
  const numCommands = commands.length;

  const { direction, location, player } = action.parameter;

  switch (action.type) {
    case 'SELECT': {
      current.index = (current.index + direction + numCommands) % numCommands;

      console.log('selected:', commands[current.index].name);

      return state;
    }

    case 'SELECT_COLUMN': {
      current.index = (current.index + direction * (columns || 1) + numCommands) % numCommands;

      console.log('selected:', commands[current.index].name);

      return state;
    }

    case 'GO_TO': {
      state.push({ layer: location, index: 0 });

      console.log('went to:', location);

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
