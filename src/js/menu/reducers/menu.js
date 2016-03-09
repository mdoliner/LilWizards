/**
 * Created by Justin on 2016-03-08.
 */
import _ from 'lodash';
import getLayer from '../get_layer';
import { fromJS } from 'Immutable';

export default function menuReducer(state, action) {
  const layer = getLayer(state.get('layerName'));
  const { columns, commands } = layer;
  const numCommands = commands && commands.length;

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { direction, player } = parameter;

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

      return state.setIn(['subMenus', player], [createMenu(layer.subMenuEntry)]);
    }

    default: {
      return state;
    }
  }
}

export function createMenu(location) {
  return fromJS({
    layerName: location,
    index: 0,
    subMenus: {},
  });
}
