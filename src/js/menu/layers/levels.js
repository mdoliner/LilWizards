/**
 * Created by Justin on 2016-03-02.
 */
'use strict';
import { startGame } from '../actions/game';

const levelsMenu = {
  type: 'basic',
  commands: [
    { name: 'Library', type: 'action', level: 'Library' },
    { name: 'Cemetery', type: 'action', level: 'Cemetery' },
    { name: 'Boarwarts', type: 'action', level: 'Boarwarts' },
    { name: 'Back', type: 'back' },
  ],

  action({ command }) {
    return (dispatch) => {
      const levelName = command.level;
      dispatch(startGame({ levelName }));
    };
  },
};

export default levelsMenu;
