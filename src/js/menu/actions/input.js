/**
 * Created by Justin on 2016-03-02.
 */
import _ from 'lodash';
import { select, confirm, back, goTo } from './menu';
import getLayer from '../get_layer';

export default function inputAction({ input, player }) {
  return (dispatch, getState) => {
    // Get the needed data.
    const state = getState();
    const menu = _.last(state.menu);
    const layer = getLayer(menu.layer);

    // Branch out depending on the input given.
    if (input === 'up' || input === 'down') {
      dispatch(select({
        player,
        direction: 0 - (input === 'up') + (input === 'down'),
      }));
    } else if (input === 'jump') {
      const command = layer.commands[menu.index];
      if (command.type === 'goTo') {
        dispatch(goTo({ player, location: command.goTo }));
      } else if (command.type === 'back') {
        dispatch(back({ player }));
      }
    } else if (input === 2) {
      dispatch(back({ player }));
    }
  };
}
