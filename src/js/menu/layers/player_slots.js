/**
 * Created by Justin on 2016-03-02.
 */
import { goTo, playerReady } from '../actions/menu';
import _ from 'lodash';

const playerSlotMenu = {
  type: 'categories',
  categories: _.times(3, (i) => {
    return {
      category: `Slot ${i + 1}`,
      commands: [
        { name: `Spell ${i + 1}`, type: 'action', slot: i },
      ],
    };
  }).concat({
    category: 'Not Ready',
    commands: [
      { name: 'Ready Up', type: 'action', ready: true, disabled: true },
    ],
  }),

  display(character) {
    const base = _.cloneDeep(playerSlotMenu.categories);
    character.get('spells').forEach((spell, idx) => {
      base[idx].commands[0].name = spell ? spell : '-----';
    });

    if (!character.get('spells').includes(null)) {
      base[3].commands[0].disabled = false;
      base[3].category = 'Spells Chosen!';
    }

    return base;
  },

  action({ player, command }) {
    return (dispatch, getState) => {
      const character = getState().characters.get(player);
      if (command.ready) {
        if (!character.get('spells').includes(null)) {
          dispatch(playerReady({ player }));
          dispatch(goTo({ player, location: 'playerReady' }));

          if (!getState().characters.filter((char) => !char.get('ready')).size) {
            dispatch(goTo({ location: 'levels' }));
          }
        }

        return;
      }

      dispatch({ type: 'CHARACTER_SELECT_SLOT', parameter: { player, slot: command.slot } });
      dispatch(goTo({ player, location: 'playerSpells' }));
    };
  },
};

export default playerSlotMenu;
