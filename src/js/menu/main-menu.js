'use strict';
import $ from 'jquery';
import _ from 'lodash';
import { GlobalSL } from '../utilities/sound_library';
import { AllPlayers } from '../base/players';
import Util from '../utilities/utils';

/**
 * The main menu object
 * @type {MainMenu}
 */
function MainMenu(options) {
  _.extend(this, options);
  this.initializeEvent && this.initializeEvent();
}

MainMenu.extend = Util.fnExtend;

MainMenu.prototype.commandTooltips = {};
MainMenu.prototype.commands = [];
MainMenu.prototype.initializeEvent = function () {};

MainMenu.prototype.swapTo = function (options) {
  MainMenu.CurrentMenu && MainMenu.CurrentMenu.remove();
  MainMenu.CurrentMenu = this;

  this.checkingInputs = setInterval(this.checkInput.bind(this), 1000 / 60);

  $(this.selector).empty();
  $('.menu-tooltip').removeClass('hidden');
  this.swapToEvent && this.swapToEvent();
  this.addItems();
};

MainMenu.prototype.addItems = function (selectorIndex) {
  $('.menu-title').html(this.title);
  $('.menu-tooltip').html(this.tooltip);
  for (var i = 0; this.commands.length > i; i++) {
    var command = this.commands[i];
    var $li = $('<li>');
    $li.addClass('menu-item');
    $li.addClass(command);
    if (i === 0 && !selectorIndex || i === selectorIndex) {
      $li.addClass('selected');
    }

    $li.html(Util.makeReadable(command));
    $li.data('command', command);
    if (this.commandTooltips) {
      var tooltip = this.commandTooltips[command];
      if (tooltip) {
        var $tooltip = $('<div class=\'menu-item-tooltip\'>');
        if (tooltip instanceof Function) {
          $tooltip.html(tooltip());
        } else {
          $tooltip.html(tooltip);
        }

        $li.append($tooltip);
      }
    }

    $(this.selector).append($li);
    $li.on('click', this.events[command].bind(this));
  }

  if (this.commands.length >= 2) {
    var $up = $('<div class=\'bounce-up-arrow\'>');
    var $down = $('<div class=\'bounce-down-arrow\'>');
    $up.html('&uarr;');
    $down.html('&darr;');
    $(this.selector).append($up);
    $(this.selector).append($down);
  }
};

MainMenu.prototype.executeCommand = function () {
  var $selected = $('.selected');
  this.events[$selected.data('command')].bind(this)();
};

MainMenu.prototype.selectCommand = function (num) {
  GlobalSL.playSE('menu-move.ogg', 100);
  var $currentItem = $('.menu-item.selected');
  var $menuItems = $('.menu-item');
  var currentIndex = $menuItems.index($currentItem);
  $currentItem.removeClass('selected');
  var newIndex = (currentIndex + num + $menuItems.length) % $menuItems.length;
  $($menuItems[newIndex]).addClass('selected');
};

MainMenu.prototype.backCommand = function () {
  GlobalSL.playSE('menu-cancel.ogg', 100);
  if (this.parentMenu) {
    this.parentMenu.swapTo({ selector: '.main-menu-items' });
  }
};

MainMenu.prototype.remove = function () {
  this.removeEvent && this.removeEvent();
  clearInterval(this.checkingInputs);
  if (this.quadViews) {
    $('.main-menu-quads').empty();
    this.quadViews.forEach(function (quad) {
      quad.remove();
    });

    this.quadViews = [];
  }
};

MainMenu.prototype.checkInput = function () {
  for (var i = 0; i < AllPlayers.length; i++) {
    var player = AllPlayers[i];
    if (this.quadViews) {
      var skip = false;
      for (var j = this.quadViews.length - 1; j >= 0; j--) {
        var quad = this.quadViews[j];
        if (player === quad.player) {
          skip = true;
        }
      }

      if (skip) {continue;}
    }

    player.checkControllerActions();
    var wizard = player.wizard;
    if (wizard.actions.jump === 'tap') {
      this.executeCommand(player);
    }

    if (wizard.actions.up === 'tap') {
      this.selectCommand(-1);
    }

    if (wizard.actions.down === 'tap') {
      this.selectCommand(1);
    }

    if (wizard.actions.spells[2] === 'tap') {
      this.backCommand();
    }
  }
};

export default MainMenu;
