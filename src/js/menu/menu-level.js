'use strict';
import MainMenu from './main-menu';
import QuadMenu from './main-quad';
import CharacterMenu from './menu-character';
import Util from '../utilities/utils';
import runGame from '../run-game';
import Levels from '../base/levels';

var events = {};
var commands = [];
for (var level in Levels) {
  if (!Levels.hasOwnProperty(level)) continue;

  events[level] = Util.args(function (nlevel) {
    runGame(Levels[nlevel], nlevel, false);
    this.remove();
  }, level);

  commands.push(level);
}

const Level = new MainMenu({
  title: 'Level Select',
  tooltip: 'Choose a level to begin playing!',
  commands: commands,
  events: events,
  parentMenu: CharacterMenu,
  selector: '.main-menu-items',
});

export default Level;
