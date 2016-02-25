'use strict';
import $ from 'jquery';
import _ from 'lodash';
import MainMenu from './main-menu';
import { GlobalSL } from '../utilities/sound_library';
import Players from '../base/players';
import Util from '../utilities/utils';

var playerSpellButtons = {
  keyboard: [
    ['O', 'I', 'U'],
    ['G', 'H', 'J'],
  ],
  gamepad: Array.apply(null, new Array(4)).map(function () { return ['1', '2', '3']; }),
};

function QuadView(options) {
  MainMenu.call(this, options);
  if (this.SE) {
    GlobalSL.playSE(this.SE, 100);
  }

  this.$el = $('<div>');

  var $h1 = $('<h1 class="quad-title">');
  $h1.html(this.quadTitle);
  this.$el.append($h1);

  this.$menuItemsList = $('<ul class=\'quad-menu-items\'>');
  this.$el.append(this.$menuItemsList);

  this.$playerPicture = $('<figure class=\'player-picture-fig\'>');
  var $image = $('<img class="player-picture-img" src="' + this.player.wizardGraphic + '">');
  this.$playerPicture.append($image);
  this.$el.append(this.$playerPicture);

  var index = 0;
  this.animatePicture = setInterval(function () {
    index = (index + 1) % 4;
    $image.css('transform', 'translateX(-' + index * 25 + '%)');
  }, 214);

  this.$playerSpells = $('<ul class=\'player-spells\'>');
  this.player.spellList.forEach(function (spell, listIndex) {
    var $spell = $('<li class=\'player-spell\'>');
    if (spell) {
      $spell.html(Util.makeReadable(spell));
    } else {
      $spell.html('-------');
    }

    if (this.isSpellMenu) {
      var $hoverEffect = $('<div class=\'spell-hover-effect\'>');
      $hoverEffect.html(playerSpellButtons[this.player.controllerType][this.player.controllerIndex][listIndex]);
      $spell.append($hoverEffect);
    }

    this.$playerSpells.append($spell);
  }.bind(this));
  this.$el.append(this.$playerSpells);

  this.$parentEl.html(this.$el);
  this.checkingInputs = setInterval(this.checkInput.bind(this), 1000 / 60);
  this.addItems();
}

Util.inherits(QuadView, MainMenu);

QuadView.prototype.addItems = function () {
  for (var i = 0; this.commands.length > i; i++) {
    var command = this.commands[i];
    var $li = $('<li>');
    $li.addClass('quad-menu-item');
    $li.addClass(command);
    if (this.isSpellMenu) {
      $li.addClass('player-spell');
    }

    if (i === 0) {
      $li.addClass('selected');
    }

    $li.html(Util.makeReadable(command));
    $li.data('command', command);
    this.$menuItemsList.append($li);

    // $li.on("click", this.events[command].bind(this));
  }

  var $closeButton = $('<button class=\'quad-close-button\'>');
  $closeButton.html('&times;');
  this.$el.append($closeButton);
  $closeButton.on('click', this.close.bind(this));
};

QuadView.prototype.close = function () {
  GlobalSL.playSE('menu-cancel.ogg', 100);
  Players.splice(Players.indexOf(this.player), 1);
  this.remove();
  MainMenu.CurrentMenu.swapTo();
};

QuadView.prototype.checkInput = function () {
  this.player.checkControllerActions();
  var wizard = this.player.wizard;
  if (wizard.actions.jump === 'tap') {
    this.executeCommand(-1);
  }

  if (wizard.actions.up === 'tap') {
    this.selectCommand(-1);
  }

  if (wizard.actions.down === 'tap') {
    this.selectCommand(1);
  }

  if (wizard.actions.left === 'tap') {
    this.changeGraphic(-1);
  }

  if (wizard.actions.right === 'tap') {
    this.changeGraphic(1);
  }

  if (wizard.actions.spells[0] === 'tap') {
    this.executeCommand(0);
  }

  if (wizard.actions.spells[1] === 'tap') {
    this.executeCommand(1);
  }

  if (wizard.actions.spells[2] === 'tap') {
    this.executeCommand(2);
  }
};

QuadView.prototype.selectCommand = function (num) {
  GlobalSL.playSE('menu-move.ogg', 100);
  var $currentItem = $(this.$menuItemsList.children('.selected')[0]);
  var $menuItems = this.$menuItemsList.children('.quad-menu-item');
  var currentIndex = $menuItems.index($currentItem);
  $currentItem.removeClass('selected');
  var newIndex = (currentIndex + num + $menuItems.length) % $menuItems.length;
  $($menuItems[newIndex]).addClass('selected');
};

QuadView.prototype.executeCommand = function (index) {
  if (index >= 0 && !this.isSpellMenu) {
    return;
  } else if (index === -1 && this.isSpellMenu) {
    index = this.player.spellList.indexOf(null);
    if (index === -1) {
      GlobalSL.playSE('menu-cancel.ogg', 100);
    } else {
      GlobalSL.playSE('right.ogg', 100);
    }
  } else if (index >= 0 && this.isSpellMenu) {
    GlobalSL.playSE('right.ogg', 100);
  } else {
    GlobalSL.playSE('menu-select.ogg', 100);
  }

  var $selected = $(this.$menuItemsList.children('.selected')[0]);
  if (!$selected.data('command')) {return;}

  this.events[$selected.data('command')].bind(this)(index);
};

QuadView.prototype.changeGraphic = function (dir) {
  GlobalSL.playSE('menu-select.ogg', 100);
  this.player.nextSprite(dir);
  this.$playerPicture.children('img').attr('src', this.player.wizardGraphic);
};

QuadView.prototype.remove = function () {
  clearInterval(this.checkingInputs);
  clearInterval(this.animatePicture);
  this.childQuad && this.childQuad.remove();
};

export default QuadView;
