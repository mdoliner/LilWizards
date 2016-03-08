/**
 * Created by Justin on 2016-03-02.
 */
import { goTo, back } from '../actions/menu';

const playerSpellMenu = {
  type: 'child',
  commands: [
    { name: 'Fireball', type: 'action', spell: 'Fireball' },
    { name: 'Sword', type: 'action', spell: 'Sword' },
    { name: 'Crash', type: 'action', spell: 'Crash' },
  ],

  action({ player, command }) {
    return (dispatch) => {
      dispatch({ type: 'CHARACTER_SELECT_SPELL', parameter: { player, spell: command.spell } });
      dispatch(back({ player }));
    };
  },
};

export default playerSpellMenu;
