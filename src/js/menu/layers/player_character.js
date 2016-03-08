/**
 * Created by Justin on 2016-03-02.
 */
import { goTo } from '../actions/menu';

const playerCharacterMenu = {
  type: 'child',
  commands: [
    { name: 'Creamy', type: 'action', sprite: require('graphics/baby_wiz_cream.png') },
    { name: 'Blueth', type: 'action', sprite: require('graphics/baby_wiz_blue.png') },
    { name: 'Greenie', type: 'action', sprite: require('graphics/baby_wiz_green.png') },
    { name: 'Purples', type: 'action', sprite: require('graphics/baby_wiz_purple.png') },
    { name: 'Redonna', type: 'action', sprite: require('graphics/baby_wiz_red.png') },
  ],

  action({ player, command }) {
    return (dispatch) => {
      dispatch({ type: 'CHARACTER_SPRITE', parameter: { player, sprite: command.sprite } });
      dispatch(goTo({ player, location: 'playerSpells' }));
    };
  },
};

export default playerCharacterMenu;
