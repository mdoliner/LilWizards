/**
 * Created by Justin on 2016-03-02.
 */
import _ from 'lodash';
const initialState = {
  phase: 'menu',
};

export default function gameReducer(state = initialState, action) {
  state = _.cloneDeep(state);
  switch (action.type) {
    case 'ACTION': {

      return state;
    }

    default: {
      return state;
    }
  }
};
