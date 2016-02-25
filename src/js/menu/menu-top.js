'use strict';
import $ from 'jquery';
import MainMenu from './main-menu';
import CharacterMenu from './menu-character';
import SettingsMenu from './menu-settings';
import { GlobalSL } from '../utilities/sound_library';
import Settings, { setSettings } from '../settings/settings';
import Players, { AllPlayers } from '../base/players';
import Player from '../base/player';
import Sprite from '../base/sprite';
import Levels from '../base/levels';
import runGame from '../run-game';

const TopMenu = new MainMenu({
  title: 'Lil\' Wizards',
  tooltip: 'Welcome to Lil\' Wizards! <br> The controls are at the bottom.',
  commands: ['demo-mode', 'local-game', 'settings'],
  events: {
    'demo-mode': function () {
      var player = AllPlayers[0];
      player.spellList = Player.randomSpellList();
      player.wizardGraphic = Sprite.WIZARDS[0];
      Players.splice(0, Players.length);
      Players.push(player);
      runGame(Levels.Library, 'Library', true);
      this.remove();
    },

    'local-game': function () {
      GlobalSL.playSE('menu-select.ogg', 100);
      CharacterMenu.swapTo({ selector: '.main-menu-items' });
    },

    settings: function () {
      GlobalSL.playSE('menu-select.ogg', 100);
      SettingsMenu.swapTo({ selector: '.main-menu-items' });
    },
  },
  commandTooltips: {
  },
  selector: '.main-menu-items',
});

export default TopMenu;
