'use strict';
import $ from 'jquery';
import _ from 'lodash';
import MainMenu from './main-menu';
import QuadMenu from './main-quad';
import LevelMenu from './menu-level';
import TopMenu from './menu-top';
import { GlobalSL } from '../utilities/sound_library';
import Players from '../base/players';
import Util from '../utilities/utils';

function CategoryView(player, $parentEl) {
  $parentEl = $parentEl || $('<li class=\'menu-quad group\'>');
  return {
    player: player,
    commands: ['ninja-spells', 'brawler-spells', 'elemental-spells', 'eldritch-spells', 'ready-up'],
    $parentEl: $parentEl,
    quadTitle: '',
    events: {
      'ninja-spells': function () {
        this.remove();
        this.childQuad = new QuadMenu(SpellsView(player, this.$parentEl, 'Ninja', [
          'Sword',
          'FanOfKnives',
          'Teleport',
          'ToxicDarts',
        ]));
      },

      'brawler-spells': function () {
        this.remove();
        this.childQuad = new QuadMenu(SpellsView(player, this.$parentEl, 'Brawler', [
          'Crash',
          'Updraft',
          'Wave',
          'WreckingBall',
          'MeteorShield',
        ]));
      },

      'elemental-spells': function () {
        this.remove();
        this.childQuad = new QuadMenu(SpellsView(player, this.$parentEl, 'Elemental', [
          'Fireball',
          'RayCannon',
          'ForcePush',
          'NaturesWrath',
        ]));
      },

      'eldritch-spells': function () {
        this.remove();
        this.childQuad = new QuadMenu(SpellsView(player, this.$parentEl, 'Eldritch', [
          'Vomit',
          'EvilCandy',
          'Berserk',
          'DarkRift',
        ]));
      },

      'ready-up': function () {
        if (this.player.spellList.indexOf(null) !== -1) {
          GlobalSL.playSE('fail.ogg', 100);
          return;
        }

        this.remove();
        this.player.menuReady = true;
        this.childQuad = new QuadMenu(ReadyUpView(this.player, this.$parentEl));
        var numOfPlayersReady = 0;
        for (var i = Players.length - 1; i >= 0; i--) {
          if (Players[i].menuReady) {
            numOfPlayersReady++;
          }
        }

        if (numOfPlayersReady === Players.length) {
          LevelMenu.swapTo();
        }
      },
    },
  };
}

var SpellsView = function (player, $parentEl, title, spells) {
  var events = {};
  spells.forEach(function (spell) {
    events[spell] = function (spellIndex) {
      if (spellIndex >= 0) {
        var newSpell = spell;
        var oldIndex;
        if ((oldIndex = player.spellList.indexOf(newSpell)) !== -1) {
          player.spellList[oldIndex] = null;
        }

        player.spellList[spellIndex] = spell;
      }

      this.remove();
      this.childQuad = new QuadMenu(CategoryView(player, $parentEl));
    };
  });

  return {
    player: player,
    commands: spells,
    $parentEl: $parentEl,
    quadTitle: title + ' Spells',
    isSpellMenu: true,
    events: events,
  };
};

var ReadyUpView = function (player, $parentEl) {
  return {
    player: player,
    commands: ['de-ready'],
    $parentEl: $parentEl,
    quadTitle: 'Ready!',
    SE: 'equip.ogg',
    events: {
      'de-ready': function () {
        this.player.menuReady = false;
        this.remove();
        this.childQuad = new QuadMenu(CategoryView(this.player, this.$parentEl));
      },
    },
  };
};

var Character = new MainMenu({
  title: 'Character Select',
  tooltip: 'Press jump to join. <br> Use spell keys to select spells. <br> Ready up when you have 3 spells.',
  commands: ['back'],
  events: {
    back: function () {
      GlobalSL.playSE('menu-cancel.ogg', 100);
      TopMenu.swapTo();
    },
  },
  quadViews: [],
  executeCommand: function (player) {
    if (Players.length >= 4) {return;}

    if (Players.length > 1) {
      $('.menu-tooltip').addClass('hidden');
    }

    GlobalSL.playSE('menu-select.ogg', 100);
    player.nextSprite(1);
    var quad = new QuadMenu(CategoryView(player));
    Players.push(player);
    $('.main-menu-quads').append(quad.$parentEl);
    this.quadViews.push(quad);
  },

  parentMenu: TopMenu,
  swapToEvent: function () {
    if (Players.length > 2) {
      $('.menu-tooltip').addClass('hidden');
    }

    Players.forEach(function (player) {
      var quad = new QuadMenu(CategoryView(player));
      $('.main-menu-quads').append(quad.$parentEl);
      this.quadViews.push(quad);
    }.bind(this));
  },

  removeEvent: function () {
    Players.forEach(function (player) {
      player.menuReady = false;
    });
  },

  selector: '.main-menu-items',
});

export default Character;
