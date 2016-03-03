/**
 * Created by Justin on 2016-03-03.
 */
import _ from 'lodash';
const initialState = {

};

export default function characterReducer(state = initialState, action) {
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
