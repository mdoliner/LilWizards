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

  switch (action.type) {
    case 'SELECT': {
      const { direction } = action.parameter;

      current.index = (current.index + direction + menu.commands.length) % menu.commands.length;

      console.log('selected:', menu.commands[current.index].name);

      return state;
    }

    case 'GO_TO': {
      const { location } = action.parameter;
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
  }
}
