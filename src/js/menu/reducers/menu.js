/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
import getLayer from '../get_layer';

const initialState = [{
  layer: 'top',
  index: 0,
}];

export default function menuReducer(state = initialState, action) {
  state = _.cloneDeep(state);
  const current = _.last(state);
  const menu = getLayer(current.layer);

  switch (action.type) {
    case 'SELECT': {
      const { direction } = action.parameter;

      current.index = (current.index + direction + menu.commands.length) % menu.commands.length;

      return state;
    }

    case 'GO_TO': {
      const { location } = action.parameter;
      state.push({ layer: location, index: 0 });

      return state;
    }

    case 'BACK': {

      return state;
    }

    default: {
      return state;
    }
  }
};
