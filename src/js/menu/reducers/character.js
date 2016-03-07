/**
 * Created by Justin on 2016-03-03.
 */
import _ from 'lodash';
const initialState = {

};

export default function characterReducer(state = initialState, action) {
  // Ensure the state is safely mutable
  state = _.cloneDeep(state);

  // Resolve the parameters
  const parameter = action.parameter || {};
  const { player } = parameter;

  switch (action.type) {
    case 'ADD_CHILD': {
      state[player] = createPlayer();

      return state;
    }

    default: {
      return state;
    }
  }
};

function createPlayer() {
  return {
    character: null,
    spells: {
      0: null,
      1: null,
      2: null,
    },
  };
}
