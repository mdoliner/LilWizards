'use strict';
import { GlobalSL } from './utilities/sound_library';
import Player from './base/player';
import { AllPlayers } from './base/players';
import PseudoWizard from './base/pseudo_wizard';
import $ from 'jquery';
import './menu';
import registerPlayer from './menu/register_players';

//import TopMenu from './menu/menu-top';

$(function () {
  if (window.__TEST__) return;

  GlobalSL.getEls();
  GlobalSL.playBGM('Dig-It.mp3');
  AllPlayers.push(
    registerPlayer(new Player({
      controllerType: 'keyboard',
      controllerIndex: 0,
      wizard: new PseudoWizard(),
    })),
    registerPlayer(new Player({
      controllerType: 'keyboard',
      controllerIndex: 1,
      wizard: new PseudoWizard(),
    }))
  );

  //TopMenu.swapTo({ selector: '.main-menu-items' });
  var gamepadLength = 0;
  setInterval(function () {
    if (Gamepad.gamepads.length > gamepadLength) {
      for (var i = gamepadLength; i < Gamepad.gamepads.length; i++) {
        const player = new Player({
          controllerType: 'gamepad',
          controllerIndex: i,
          wizard: new PseudoWizard(),
        });

        registerPlayer(player);
        AllPlayers.push(player);

        gamepadLength++;
      }
    }
  }, 1000);
});
