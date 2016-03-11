/**
 * Created by Justin on 2016-03-11.
 */
import Levels from '../../base/levels';
import runGame from '../../run-game';
import Players from '../../base/players';
import _ from 'lodash';

export function startGame({ levelName }) {
  return (dispatch, getState) => {
    dispatch(enterGame());
    getState().characters.forEach((character, id) => {
      const player = _.find(Players, { id });
      player.applyCharacterConfiguration(character);
    });

    runGame(Levels[levelName], levelName);
  };
}

export function enterGame() {
  return { type: 'ENTER_GAME' };
}
