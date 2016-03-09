/**
 * Created by Justin on 2016-03-03.
 */
import { Map, Record } from 'Immutable';

const initialState = Map({});

export default function characterReducer(state = initialState, action) {
  // Resolve the parameters
  const parameter = action.parameter || {};
  const { player, spell, slot, sprite } = parameter;

  switch (action.type) {
    case 'ADD_CHILD': {
      return state.set(player, createPlayer());
    }

    case 'CHARACTER_SELECT_SLOT': {
      return state.setIn([player, 'selectedSlot'], slot);
    }

    case 'CHARACTER_SELECT_SPELL': {
      return state.update(player, (char) => {
        return char.setIn(['spells', String(char.selectedSlot)], spell)
          .set('selectedSlot', null);
      });
    }

    case 'CHARACTER_SELECT_SPRITE': {
      return state.setIn(['player', 'sprite'], sprite);
    }

    default: {
      return state;
    }
  }
};

const Player = Record({
  sprite: null,
  selectedSlot: null,
  spells: Map({
    0: null,
    1: null,
    2: null,
  }),
});

function createPlayer() {
  return new Player();
}
