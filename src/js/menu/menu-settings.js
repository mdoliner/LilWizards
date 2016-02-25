'use strict';
import $ from 'jquery';
import MainMenu from './main-menu';
import TopMenu from './menu-top';
import { GlobalSL } from '../utilities/sound_library';
import Settings, { setSettings } from '../settings/settings';

const WinKillsSelection = [1, 5, 10, 20, 40, 100];
const VolumeSelection = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

const SettingsMenu = new MainMenu({
  title: 'Settings',
  tooltip: 'Hey look! Settings!',
  commands: ['kill-count', 'effect-vol', 'music-vol', 'Back'],
  events: {
    'kill-count': function () {
      GlobalSL.playSE('menu-select.ogg', 100);
      var index = WinKillsSelection.indexOf(Settings.WinKills);
      Settings.WinKills = WinKillsSelection[(index + 1) % WinKillsSelection.length];
      setSettings();

      $(this.selector).empty();
      this.addItems(0);
    },

    'effect-vol': function () {
      var index = VolumeSelection.indexOf(Settings.SEVolume);
      Settings.SEVolume = VolumeSelection[(index + 1) % VolumeSelection.length];
      setSettings();

      GlobalSL.playSE('menu-select.ogg', 100);

      $(this.selector).empty();
      this.addItems(1);
    },

    'music-vol': function () {
      GlobalSL.playSE('menu-select.ogg', 100);
      var index = VolumeSelection.indexOf(Settings.BGMVolume);
      Settings.BGMVolume = VolumeSelection[(index + 1) % VolumeSelection.length];
      GlobalSL.adjustBGMVolume();
      setSettings();

      $(this.selector).empty();
      this.addItems(2);
    },

    Back: function () {
      GlobalSL.playSE('menu-cancel.ogg', 100);

      TopMenu.swapTo();
    },
  },
  commandTooltips: {
    'kill-count': function () {
      return 'Current Kill Count to Win: ' + Settings.WinKills;
    },

    'effect-vol': function () {
      return 'Current Sound Effect Volume Level: ' + Settings.SEVolume * 100 + '%';
    },

    'music-vol': function () {
      return 'Current Music Volume Level: ' + Settings.BGMVolume * 100 + '%';
    },
  },
  selector: '.main-menu-items',
  parentMenu: TopMenu,
});

export default SettingsMenu;
