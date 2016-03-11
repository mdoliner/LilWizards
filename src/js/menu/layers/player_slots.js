/**
 * Created by Justin on 2016-03-02.
 */
import { goTo } from '../actions/menu';
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
  }),

  action({ player, command }) {
    return (dispatch) => {
      dispatch({ type: 'CHARACTER_SELECT_SLOT', parameter: { player, slot: command.slot } });
      dispatch(goTo({ player, location: 'playerSpells' }));
    };
  },
};

export default playerSlotMenu;
