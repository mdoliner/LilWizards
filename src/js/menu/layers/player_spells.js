/**
 * Created by Justin on 2016-03-02.
 */
import { goTo, back } from '../actions/menu';
import _ from 'lodash';

const spellsByCategory = {
  Brawler: ['Crash', 'MeteorShield', 'Updraft', 'Wave', 'WreckingBall'],
  Eldritch: ['Berserk', 'Candy', 'DarkRift', 'Vomit'],
  Elemental: ['Fireball', 'ForcePush', 'NaturesWrath', 'RayCannon'],
  Ninja: ['FanOfKnives', 'Sword', 'Teleport', 'ToxicDarts'],
};

const playerSpellMenu = {
  type: 'categories',
  categories: _.map(spellsByCategory, (spells, categoryName) => {
    return {
      category: categoryName,
      commands: _.map(spells, (spellName) => {
        return { name: spellName, type: 'action', spell: spellName };
      }),
    };
  }),

  display(character) {
    const base = _.cloneDeep(playerSpellMenu.categories);
    const spells = character.get('spells');
    _.each(base, (category) => {
      _.each(category.commands, (command) => {
        command.disabled = spells.includes(command.spell);
      });
    });

    return base;
  },

  action({ player, command }) {
    return (dispatch, getState) => {
      const character = getState().characters.get(player);
      if (character.get('spells').includes(command.spell)) {
        return;
      }

      dispatch({ type: 'CHARACTER_SELECT_SPELL', parameter: { player, spell: command.spell } });
      dispatch(back({ player }));
    };
  },
};

export default playerSpellMenu;
