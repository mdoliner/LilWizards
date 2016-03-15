/**
 * Created by Justin on 2016-03-02.
 */
import store from './index';
import inputAction from './actions/input';
import { AllPlayers } from '../base/players';

export default function listenToPlayer(player) {
  if (player._isBeingListenedTo) return;
  player._isBeingListenedTo = true;
  player.on('input', (input) => {
    if (store.getState().game.get('phase') === 'menu') {
      store.dispatch(inputAction({ input, player: player.id }));
    }
  });

  return player;
}

let inputListener;
listenToAllPlayers();

store.subscribe(() => {
  const state = store.getState();

  if (!inputListener && state.game.get('phase') === 'menu') {
    listenToAllPlayers();
  } else if (inputListener && state.game.get('phase') !== 'menu') {
    clearInterval(inputListener);
    inputListener = null;
  }
});

function listenToAllPlayers() {
  inputListener = setInterval(() => {
    for (let i = 0, n = AllPlayers.length; i < n; i++) {
      AllPlayers[i].checkControllerActions();
    }
  }, 1000 / 60);
}
