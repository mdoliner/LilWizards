/**
 * Created by Justin on 2016-03-02.
 */
import { goTo, back } from '../actions/menu';
import _ from 'lodash';
import SpellList from '../../base/spell_list';

const playerSpellMenu = {
  type: 'child',
  commands: _.map(SpellList, (spell, spellName) => {
    return { name: spellName, type: 'action', spell: spellName };
  }),

  action({ player, command }) {
    return (dispatch) => {
      dispatch({ type: 'CHARACTER_SELECT_SPELL', parameter: { player, spell: command.spell } });
      dispatch(back({ player }));
    };
  },
};

export default playerSpellMenu;
