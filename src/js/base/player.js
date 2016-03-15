/**
 * The Player Class
 *  Digests actions from the gamepads or keyboards.
 */
'use strict';
import _ from 'lodash';
import Wizard from './wizard';
import Players from './players';
import Sprite from './sprite';
import SpellList from './spell_list';
import Spell from './spell';
import EventEmitter from 'event-emitter';

window.EE = EventEmitter;

const KeyboardControlScheme = [
  {
    up: 'up',
    right: 'right',
    down: 'down',
    left: 'left',
    jump: 'p',
    spells: ['o', 'i', 'u'],
  },
  {
    up: 'w',
    right: 'd',
    down: 's',
    left: 'a',
    jump: 'f',
    spells: ['g', 'h', 'j'],
  },
];

function Player(options) {
  this.id = _.uniqueId('player_');
  this.controllerType = options.controllerType; // "keyboard" or "gamepad"
  this.controllerIndex = options.controllerIndex;
  this.spellList = options.spellList || [null, null, null];
  this.wizardGraphic = options.wizardGraphic || require('graphics/wiz.png');
  this.wizard = options.wizard || null;
  if (this.controllerType === 'computer') {
    this.heldButtons = {};
    for (var i = 0; i < COMPUTER_ACTIONS.length; i++) {
      this.heldButtons[COMPUTER_ACTIONS[i]] = false;
    }
  }
}

_.extend(Player.prototype, EventEmitter.methods);

Player.prototype.makeWizard = function (options) {
  return this.wizard = new Wizard({
    pos: options.game.getSpawnPointPos(),
    vel: [0,0],
    horFacing: 'right',
    img: this.wizardGraphic,
    imgIndexXMax: 4,
    imgIndexYMax: 6,
    imgSizeX: 7.62,
    imgSizeY: 8,
    spellList: this.makeSpellList(),
    game: options.game,
    controllerType: this.controllerType,
  });
};

Player.prototype.makeSpellList = function () {
  var spells = [];
  this.spellList.forEach(function (spellName) {
    spells.push(SpellList[spellName]);
  });

  return spells;
};

Player.prototype.applyCharacterConfiguration = function (character) {
  this.spellList = character.get('spells').toArray();
  this.wizardGraphic = character.get('sprite');
};

Player.randomSpellList = function () {
  var spells = [];
  while (spells.length < 3) {
    var spell = Spell.TOTAL_SPELL_NAMES[Math.floor(Math.random() * Spell.TOTAL_SPELL_NAMES.length)];
    if (spells.indexOf(spell) === -1) {
      spells.push(spell);
    }
  }

  return spells;
};

Player.prototype.nextSprite = function (dir) {
  var index = Sprite.WIZARDS.indexOf(this.wizardGraphic);
  index = (index + dir + Sprite.WIZARDS.length) % Sprite.WIZARDS.length;
  this.wizardGraphic = null;
  var spriteTaken = function (graphic) {
    return Players.some(function (player) {
      return player.wizardGraphic === graphic;
    });
  };

  while (spriteTaken(Sprite.WIZARDS[index])) {
    index = (index + dir + Sprite.WIZARDS.length) % Sprite.WIZARDS.length;
  }

  return this.wizardGraphic = Sprite.WIZARDS[index];
};

Player.prototype.checkControllerActions = function () {
  if (!this.wizard) return;

  if (this.controllerType === 'keyboard') {
    this.checkKeyboardActions();
  } else if (this.controllerType === 'gamepad') {
    this.checkGamepadActions();
  } else if (this.controllerType === 'computer') {
    this.checkComputerActions();
  } else {
    console.log('player aint got a controllerType');
  }
};

Player.prototype.cycleAction = function (action, cond, isSpell) {
  const actionMap = isSpell ? this.wizard.actions.spells : this.wizard.actions;
  actionMap[action] = cond ? cyclePress(actionMap[action]) : cycleRelease(actionMap[action]);

  if (actionMap[action] === 'tap') {
    if (isSpell) {
      this.emit(`input:spell:${action}`);
    } else {
      this.emit(`input:${action}`);
    }

    this.emit('input', action);
  }

  return cond;
};

Player.prototype.moveWizard = function (amount) {
  if (amount < 0) {
    this.wizard.accelX(amount * Wizard.BASEBOOST);
    this.wizard.faceDir('left');
  } else if (amount > 0) {
    this.wizard.accelX(amount * Wizard.BASEBOOST);
    this.wizard.faceDir('right');
  }
};

Player.prototype.checkGamepadActions = function () {
  var i = this.controllerIndex;
  var leftX = Gamepad.moved(i, 'LEFT_X');
  this.cycleAction('left', Gamepad.pressed(i, 'PAD_LEFT') || leftX < -0.2);
  this.cycleAction('right', Gamepad.pressed(i, 'PAD_RIGHT') || leftX > 0.2);
  this.moveWizard(leftX);

  var leftY = Gamepad.moved(i, 'LEFT_Y');
  this.cycleAction('up', Gamepad.pressed(i, 'PAD_UP') || leftY < -0.5);
  this.cycleAction('down', Gamepad.pressed(i, 'PAD_DOWN') || leftY > 0.5);

  this.cycleAction('jump', Gamepad.pressed(i, 'FACE_1') || Gamepad.pressed(i, 'LEFT_SHOULDER'));
  this.cycleAction(0, Gamepad.pressed(i, 'FACE_3') || Gamepad.pressed(i, 'RIGHT_SHOULDER'), true);
  this.cycleAction(1, Gamepad.pressed(i, 'FACE_4') || Gamepad.pressed(i, 'LEFT_SHOULDER_BOTTOM'), true);
  this.cycleAction(2, Gamepad.pressed(i, 'FACE_2') || Gamepad.pressed(i, 'RIGHT_SHOULDER_BOTTOM'), true);
};

Player.prototype.checkKeyboardActions = function () {
  var buttons = KeyboardControlScheme[this.controllerIndex];
  this.cycleAction('left', key.isPressed(buttons.left));
  this.cycleAction('right', key.isPressed(buttons.right));
  this.moveWizard(0 - key.isPressed(buttons.left) + key.isPressed(buttons.right));

  this.cycleAction('up', key.isPressed(buttons.up));
  this.cycleAction('down', key.isPressed(buttons.down));

  this.cycleAction('jump', key.isPressed(buttons.jump));
  for (let spellIndex = 0; spellIndex < 3; spellIndex++) {
    this.cycleAction(spellIndex, key.isPressed(buttons.spells[spellIndex]), true);
  }
};

var COMPUTER_ACTIONS = ['up', 'down', 'left', 'right', 'jump', 0, 1, 2];

Player.prototype.checkComputerActions = function () {
  this.actionTimer = this.actionTimer - 1 || Math.floor(Math.random() * 30) + 45;

  if (this.actionTimer < 2) {
    var actionIndex = Math.floor(Math.random() * COMPUTER_ACTIONS.length);
    while (this.heldButtons[COMPUTER_ACTIONS[actionIndex]]) {
      this.heldButtons[COMPUTER_ACTIONS[actionIndex]] = false;
      actionIndex = Math.floor(Math.random() * COMPUTER_ACTIONS.length);
    }

    this.heldButtons[COMPUTER_ACTIONS[actionIndex]] = true;
    var offActionIndex = Math.floor(actionIndex + (COMPUTER_ACTIONS.length - 2) * Math.random() + 1);
    offActionIndex = offActionIndex % COMPUTER_ACTIONS.length;
    this.heldButtons[COMPUTER_ACTIONS[offActionIndex]] = false;
  }

  for (var i = 0; i < COMPUTER_ACTIONS.length; i++) {
    var action = COMPUTER_ACTIONS[i];
    this.cycleAction(action, this.heldButtons[action], !action.length);
    if (this.heldButtons[action]) {
      this.moveWizard(0 - (action === 'left') + (action === 'right'));
    }
  }
};

function cyclePress(action) {
  if (action === 'none') return 'tap';
  if (action === 'tap') return 'hold';
  if (action === 'hold') return 'hold';
  if (action === 'release') return 'tap';
  return 'none';
}

function cycleRelease(action) {
  if (action === 'none') return 'none';
  if (action === 'tap') return 'release';
  if (action === 'hold') return 'release';
  if (action === 'release') return 'none';
  return 'none';
}

export default Player;
