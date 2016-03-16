/**
 * The Game View is the overhead for the core game, handling the looping and canvas.
 */
'use strict';
import $ from 'jquery';
import { GlobalSL } from '../utilities/sound_library';
import Wizard from '../base/wizard';
import store from '../menu';
import { finishGame } from '../menu/actions/game';

const cycles = window.cycles = { avgDraw: 1, drawTimes: 1, avgStep: 1, stepTimes: 1 };

function GameView(bgctx, fgctx, game, players) {
  this.game = game;
  this.fgctx = fgctx;
  this.bgctx = bgctx;
  this.players = players;
  this.fps = {
    startTime: 0,
    frameNumber: 0,
    $element: $('.fps-counter'),
    getFPS: function () {
      this.frameNumber++;
      var d = performance.now();
      var currentTime = (d - this.startTime) / 1000;
      var result = Math.floor((this.frameNumber / currentTime));

      if (currentTime > 1) {
        this.startTime = performance.now();
        this.frameNumber = 0;
      }

      return result;

    },
  };
}

GameView.prototype.startGame = function () {
  this.gameInterval = setInterval(() => {
    cycles.stepTimes++;
    const now = performance.now();
    this.checkPlayerActions();
    this.wizardActions();
    this.game.step();
    this.fps.$element.html('FPS: ' + this.fps.getFPS());
    if (this.game.gameEnded) {
      this.remove();
    }

    cycles.avgStep = (cycles.avgStep * (cycles.stepTimes - 1) + performance.now() - now) / cycles.stepTimes;
  }, 1000 / 120);

  this.drawInterval = setInterval(() => {
    cycles.drawTimes++;
    const now = performance.now();
    this.game.draw(this.fgctx, this.bgctx);
    cycles.avgDraw = (cycles.avgDraw * (cycles.drawTimes - 1) + performance.now() - now) / cycles.drawTimes;
  }, 1000 / 60);
};

GameView.prototype.remove = function () {
  clearInterval(this.gameInterval);
  clearInterval(this.drawInterval);
  this.fps.$element.html('');
  var $bgm = $('#bgm');
  $bgm[0].pause();
  GlobalSL.playBGM('Dig-It.mp3');
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].controllerType === 'computer') {
      this.players.splice(i, 1);
      i--;
    }
  }

  $('#menu').removeClass('hidden');
  store.dispatch(finishGame());
};

GameView.prototype.checkPlayerActions = function () {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].checkControllerActions();
  }
};

GameView.prototype.wizardActions = function () {
  var wizards = this.game.wizards;
  for (var i = 0; i < wizards.length; i++) {
    var wizard = wizards[i];
    if (wizard.isDead()) continue;

    if (wizard.actions.jump === 'tap') {
      wizard.jump(Wizard.BASEJUMP);
    }

    if (wizard.actions.jump === 'hold') {
      wizard.dynamicJump();
    }

    if (wizard.actions.up === 'tap') {
      wizard.faceDir('up');
    } else if (wizard.actions.up === 'release') {
      wizard.verFacing = null;
    }

    if (wizard.actions.down === 'tap') {
      wizard.faceDir('down');
    } else if (wizard.actions.down === 'release') {
      wizard.verFacing = null;
    }

    for (var spellIndex = 0; spellIndex < wizard.actions.spells.length; spellIndex++) {
      if (wizard.actions.spells[spellIndex] === 'tap') {
        wizard.castSpell(spellIndex);
      }
    }
  }
};

export default GameView;
