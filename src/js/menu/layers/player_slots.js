/**
 * Created by Justin on 2016-03-02.
 */
import { goTo } from '../actions/menu';

const playerSlotMenu = {
  type: 'child',
  commands: [
    { name: 'Spell 1', type: 'action', slot: 0 },
    { name: 'Spell 2', type: 'action', slot: 1 },
    { name: 'Spell 3', type: 'action', slot: 2 },
  ],

  action({ player, command }) {
    return (dispatch) => {
      dispatch({ type: 'CHARACTER_SELECT_SLOT', parameter: { player, slot: command.slot } });
      dispatch(goTo({ player, location: 'playerSpells' }));
    };
  },
};

export default playerSlotMenu;
