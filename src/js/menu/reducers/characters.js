/**
 * Created by Justin on 2016-03-03.
 */
import { Map, Record } from 'immutable';

const initialState = Map({});

export default function charactersReducer(state = initialState, action) {
  // Resolve the parameters
  const parameter = action.parameter || {};
  const { player, spell, slot, sprite } = parameter;

  switch (action.type) {
    case 'ADD_CHILD': {
      return state.set(player, createPlayer());
    }

    case 'REMOVE_CHILD': {
      return state.delete(player);
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
      return state.setIn([player, 'sprite'], sprite);
    }

    case 'PLAYER_READY': {
      return state.setIn([player, 'ready'], true);
    }

    case 'PLAYER_UNREADY': {
      return state.setIn([player, 'ready'], false);
    }

    case 'CLEAR_READY': {
      return state.map(player => player.set('ready', false));
    }

    default: {
      return state;
    }
  }
};

const Player = Record({
  sprite: null,
  selectedSlot: null,
  ready: false,
  spells: Map({
    0: null,
    1: null,
    2: null,
  }),
});

function createPlayer() {
  return new Player();
}
