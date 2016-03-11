/**
 * Created by Justin on 2016-03-11.
 */
import Levels from '../../base/levels';
import runGame from '../../run-game';
import { AllPlayers } from '../../base/players';
import _ from 'lodash';

export function startGame({ levelName }) {
  return (dispatch, getState) => {
    dispatch(enterGame());
    getState().characters.forEach((character, id) => {
      console.log('id:', id);
      const player = _.find(AllPlayers, { id });
      player.applyCharacterConfiguration(character);
    });

    runGame(Levels[levelName], levelName);
  };
}

export function enterGame() {
  return { type: 'ENTER_GAME' };
}
