/**
 * Created by Justin on 2016-03-02.
 */
import _ from 'lodash';
import { select, selectColumn, confirm, back, goTo, addChild, removeChild } from './menu';
import getLayer from '../get_layer';
import Players, { AllPlayers } from '../../base/players';
import { GlobalSL } from '../../utilities/sound_library';

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
  if (menu.hasIn(['subMenus', player])) {
    menu = menu.getIn(['subMenus', player, -1]);
    layer = getLayer(menu.get('layerName'));
  }

  // Branch out depending on the input given.
  if (input === 'up' || input === 'down') {
    // Upon Up or Down, move the menu selector
    GlobalSL.playSE('menu-move2.wav');
    dispatch(select({
      player,
      direction: 0 - (input === 'up') + (input === 'down'),
    }));
  } else if (input === 'left' || input === 'right') {
    // Upon Left or Right, move the menu selector horizontally
    GlobalSL.playSE('menu-move2.wav');
    dispatch(selectColumn({
      player,
      direction: 0 - (input === 'left') + (input === 'right'),
    }));
  } else if (input === 'jump') {
    let command;
    if (layer.type === 'categories') {
      command = getCategoryCommand(menu, layer);
    } else {
      command = getBasicCommand(menu, layer);
    }

    if (command.type === 'goTo') {
      GlobalSL.playSE('menu-select2.wav');
      dispatch(goTo({ player, location: command.goTo }));
    } else if (command.type === 'action') {
      GlobalSL.playSE('menu-select2.wav');
      dispatch(layer.action({ player, command }));
    } else if (command.type === 'back') {
      GlobalSL.playSE('menu-cancel2.wav');
      dispatch(back({ player }));
    }
  } else if (input === 2) {
    if (layer.type === 'child') {
      GlobalSL.playSE('menu-remove.wav');
      dispatch(removeChild({ player }));
    } else {
      GlobalSL.playSE('menu-cancel2.wav');
      dispatch(back({ player }));
    }
  }
}

function getBasicCommand(menu, layer) {
  return layer.commands[menu.get('index')];
}

function getCategoryCommand(menu, layer) {
  return layer.categories[menu.get('colIndex')].commands[menu.get('index')];
}

function parentMenu({ input, player, state, menu, layer, dispatch }) {
  // Branch out depending on the input given.
  if (input === 'jump') {
    // Add a child menu
    GlobalSL.playSE('menu-add.wav');
    dispatch(addChild({ player }));
    Players.push(_.find(AllPlayers, { id: player }));
  } else if (input === 2) {
    GlobalSL.playSE('menu-cancel2.wav');
    dispatch(back({ player }));
  }
}

function childMenu({ input, player, state, menu, layer, dispatch }) {

}
