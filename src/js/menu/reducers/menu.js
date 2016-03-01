/**
 * Created by Justin on 2016-02-29.
 */
import _ from 'lodash';
const initialState = [];

export default function menuReducer(state = initialState, action) {
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
