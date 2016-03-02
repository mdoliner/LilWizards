/**
 * Created by Justin on 2016-03-02.
 */
import store from './index';
import inputAction from './actions/input';
import { AllPlayers } from '../base/players';

export default function listenToPlayer(player) {
  if (player._isBeingListenedTo) return;
  player._isBeingListenedTo = true;
  player.on('input', (action) => {
    if (store.getState().game.phase === 'menu') {
      store.dispatch(inputAction(action));
    }
  });

  return player;
}

let inputListener;
listenToAllPlayers();

store.subscribe(() => {
  const state = store.getState();

  if (!inputListener && state.game.phase === 'menu') {
    listenToAllPlayers();
  } else if (inputListener && state.game.phase !== 'menu') {
    clearInterval(inputListener);
  }
});

function listenToAllPlayers() {
  inputListener = setInterval(() => {
    for (let i = 0, n = AllPlayers.length; i < n; i++) {
      AllPlayers[i].checkControllerActions();
    }
  }, 1000 / 60);
}
