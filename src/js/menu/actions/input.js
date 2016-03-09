/**
 * Created by Justin on 2016-03-02.
 */
import _ from 'lodash';
import { select, selectColumn, confirm, back, goTo, addChild } from './menu';
import getLayer from '../get_layer';

export default function inputAction({ input, player }) {
  return (dispatch, getState) => {
    // Get the needed data.
    const state = getState();
    const menu = state.menu.last();
    const layer = getLayer(menu.get('layerName'));
    const branchingOptions = {
      input,
      player,
      state,
      menu,
      layer,
      dispatch,
    };

    const subMenus = menu.get('subMenus');
    if (layer.type === 'parent' && subMenus && !subMenus.get(player)) {
      // If the layer is a parent layer, and the player isn't registered.
      return parentMenu(branchingOptions);
    } else {
      return basicMenu(branchingOptions);
    }
  };
}

function basicMenu({ input, player, state, menu, layer, dispatch }) {
  // Branch out depending on the input given.
  if (input === 'up' || input === 'down') {
    // Upon Up or Down, move the menu selector
    dispatch(select({
      player,
      direction: 0 - (input === 'up') + (input === 'down'),
    }));
  } else if (input === 'left' || input === 'right') {
    // Upon Left or Right, move the menu selector horizontally
    dispatch(selectColumn({
      player,
      direction: 0 - (input === 'left') + (input === 'right'),
    }));
  } else if (input === 'jump') {
    if (menu.hasIn(['subMenus', player])) {
      menu = menu.getIn(['subMenus', player, -1]);
      layer = getLayer(menu.get('layerName'));
    }

    const command = layer.commands[menu.get('index')];
    if (command.type === 'goTo') {
      dispatch(goTo({ player, location: command.goTo }));
    } else if (command.type === 'action') {
      dispatch(layer.action({ player, command }));
    } else if (command.type === 'back') {
      dispatch(back({ player }));
    }
  } else if (input === 2) {
    dispatch(back({ player }));
  }
}

function parentMenu({ input, player, state, menu, layer, dispatch }) {
  // Branch out depending on the input given.
  if (input === 'jump') {
    // Add a child menu
    dispatch(addChild({ player }));
  } else if (input === 2) {
    dispatch(back({ player }));
  }
}

function childMenu({ input, player, state, menu, layer, dispatch }) {

}
