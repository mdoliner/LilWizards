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
  const { player, spell, slot, sprite } = parameter;

  switch (action.type) {
    case 'ADD_CHILD': {
      state[player] = createPlayer();

      return state;
    }

    case 'CHARACTER_SELECT_SLOT': {
      state[player].selectedSlot = slot;

      return state;
    }

    case 'CHARACTER_SELECT_SPELL': {
      const char = state[player];
      char.spells[char.selectedSlot] = spell;
      char.selectedSlot = null;

      return state;
    }

    case 'CHARACTER_SELECT_SPRITE': {
      state[player].sprite = sprite;

      return state;
    }

    default: {
      return state;
    }
  }
};

function createPlayer() {
  return {
    sprite: null,
    selectedSlot: null,
    spells: {
      0: null,
      1: null,
      2: null,
    },
  };
}
