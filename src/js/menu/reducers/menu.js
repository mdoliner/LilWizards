/**
 * Created by Justin on 2016-03-08.
 */
import _ from 'lodash';
import getLayer from '../get_layer';

export default function menuReducer(state, action) {
  const layer = getLayer(state.layer);
  const { columns, commands } = layer;
  const numCommands = commands && commands.length;

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { direction, player } = parameter;

  // Detect action types
  switch (action.type) {
    case 'SELECT': {
      return _.extend({}, state, {
        index: (state.index + direction + numCommands) % numCommands,
      });
    }

    case 'SELECT_COLUMN': {
      const mathFn = Math[direction < 0 ? 'ceil' : 'floor'];
      const columnAdjust = mathFn(direction *  numCommands / (columns || 1));

      return _.extend({}, state, {
        index: (state.index + columnAdjust + numCommands) % numCommands,
      });
    }

    case 'ADD_CHILD': {
      if (_.size(state.subMenus) > 3) {
        console.log('too many children');
        return state;
      }

      const subMenus = _.extend({}, state.subMenus, {
        [player]: [createMenu(layer.subMenuEntry)],
      });

      return _.extend({}, state, {
        subMenus,
      });
    }

    default: {
      return state;
    }
  }
}

export function createMenu(location) {
  return {
    layer: location,
    index: 0,
    subMenus: {},
  };
}
