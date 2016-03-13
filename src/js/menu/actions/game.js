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

    const players = [];
    getState().characters.forEach((character, id) => {
      const player = _.find(AllPlayers, { id });
      player.applyCharacterConfiguration(character);
      players.push(player);
    });

    runGame(Levels[levelName], levelName, players);
  };
}

export function enterGame() {
  return { type: 'ENTER_GAME' };
}
