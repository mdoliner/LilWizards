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

Player.prototype.cycleAction = function (action, cond) {

};

Player.prototype.checkGamepadActions = function () {
  var boost = Wizard.BASEBOOST;
  var i = this.controllerIndex;
  var leftX = Gamepad.moved(i, 'LEFT_X');
  if (Gamepad.pressed(i, 'PAD_LEFT') || leftX < 0) {
    this.wizard.accelX(leftX * boost || -boost);
    this.wizard.faceDir('left');
    this.wizard.actions.left = cyclePress(this.wizard.actions.left);
  } else {
    this.wizard.actions.left = cycleRelease(this.wizard.actions.left);
  }

  if (Gamepad.pressed(i, 'PAD_RIGHT') || leftX > 0) {
    this.wizard.accelX(leftX * boost || boost);
    this.wizard.faceDir('right');
    this.wizard.actions.right = cyclePress(this.wizard.actions.right);
  } else {
    this.wizard.actions.right = cycleRelease(this.wizard.actions.right);
  }

  var leftY = Gamepad.moved(i, 'LEFT_Y');
  if (Gamepad.pressed(i, 'PAD_UP') || leftY < -0.5) {
    this.wizard.actions.up = cyclePress(this.wizard.actions.up);
  } else {
    this.wizard.actions.up = cycleRelease(this.wizard.actions.up);
  }

  if (Gamepad.pressed(i, 'PAD_DOWN') || leftY > 0.5) {
    this.wizard.actions.down = cyclePress(this.wizard.actions.down);
  } else {
    this.wizard.actions.down = cycleRelease(this.wizard.actions.down);
  }

  if (Gamepad.pressed(i, 'FACE_1') || Gamepad.pressed(i, 'LEFT_SHOULDER')) {
    this.wizard.actions.jump = cyclePress(this.wizard.actions.jump);
  } else {
    this.wizard.actions.jump = cycleRelease(this.wizard.actions.jump);
  }

  if (Gamepad.pressed(i, 'FACE_3') || Gamepad.pressed(i, 'RIGHT_SHOULDER')) {
    this.wizard.actions.spells[0] = cyclePress(this.wizard.actions.spells[0]);
  } else {
    this.wizard.actions.spells[0] = cycleRelease(this.wizard.actions.spells[0]);
  }

  if (Gamepad.pressed(i, 'FACE_4') || Gamepad.pressed(i, 'LEFT_SHOULDER_BOTTOM')) {
    this.wizard.actions.spells[1] = cyclePress(this.wizard.actions.spells[1]);
  } else {
    this.wizard.actions.spells[1] = cycleRelease(this.wizard.actions.spells[1]);
  }

  if (Gamepad.pressed(i, 'FACE_2') || Gamepad.pressed(i, 'RIGHT_SHOULDER_BOTTOM')) {
    this.wizard.actions.spells[2] = cyclePress(this.wizard.actions.spells[2]);
  } else {
    this.wizard.actions.spells[2] = cycleRelease(this.wizard.actions.spells[2]);
  }
};

Player.prototype.checkKeyboardActions = function () {
  var boost = Wizard.BASEBOOST;

  //var boost = 5;
  var wizard = this.wizard;
  var buttons = KeyboardControlScheme[this.controllerIndex];
  if (key.isPressed(buttons.left)) {
    wizard.actions.left = cyclePress(wizard.actions.left);
    wizard.accelX(-boost);

    //wizard.moveX(-boost);
    wizard.faceDir('left');
  } else {
    wizard.actions.left = cycleRelease(wizard.actions.left);
  }

  if (key.isPressed(buttons.right)) {
    wizard.actions.right = cyclePress(wizard.actions.right);
    wizard.accelX(boost);

    //wizard.moveX(boost);
    wizard.faceDir('right');
  } else {
    wizard.actions.right = cycleRelease(wizard.actions.right);
  }

  if (key.isPressed(buttons.down)) {
    wizard.actions.down = cyclePress(wizard.actions.down);
  } else {
    wizard.actions.down = cycleRelease(wizard.actions.down);
  }

  if (key.isPressed(buttons.up)) {
    wizard.actions.up = cyclePress(wizard.actions.up);
  } else {
    wizard.actions.up = cycleRelease(wizard.actions.up);
  }

  if (key.isPressed(buttons.jump)) {
    wizard.actions.jump = cyclePress(wizard.actions.jump);
  } else {
    wizard.actions.jump = cycleRelease(wizard.actions.jump);
  }

  for (var spellIndex = 0; spellIndex < wizard.actions.spells.length; spellIndex++) {
    if (key.isPressed(buttons.spells[spellIndex])) {
      wizard.actions.spells[spellIndex] = cyclePress(wizard.actions.spells[spellIndex]);
    } else {
      wizard.actions.spells[spellIndex] = cycleRelease(wizard.actions.spells[spellIndex]);
    }
  }
};

var COMPUTER_ACTIONS = ['up', 'down', 'left', 'right', 'jump', 'spells0', 'spells1', 'spells2'];

Player.prototype.checkComputerActions = function () {
  this.actionTimer = this.actionTimer - 1 || Math.floor(Math.random() * 30) + 45;
  var boost = Wizard.BASEBOOST;
  var actionIndex = Math.floor(Math.random() * COMPUTER_ACTIONS.length);
  var wizard = this.wizard;

  if (this.actionTimer < 2) {
    while (this.heldButtons[COMPUTER_ACTIONS[actionIndex]]) {
      this.heldButtons[COMPUTER_ACTIONS[actionIndex]] = false;
      actionIndex = Math.floor(Math.random() * COMPUTER_ACTIONS.length);
    }

    this.heldButtons[COMPUTER_ACTIONS[actionIndex]] = true;
    var offActionIndex = Math.floor(actionIndex + (COMPUTER_ACTIONS.length - 2) * Math.random() + 1);
    offActionIndex = offActionIndex % COMPUTER_ACTIONS.length;
    this.heldButtons[COMPUTER_ACTIONS[offActionIndex]] = false;
  }

  // TODO: Fix this code.

  for (var i = 0; i < COMPUTER_ACTIONS.length; i++) {
    var action = COMPUTER_ACTIONS[i];
    var spellIndex;
    if (this.heldButtons[action]) {
      if (action.match(/spells/)) {
        spellIndex = action.slice(6);
        wizard.actions.spells[spellIndex] = cyclePress(wizard.actions.spells[spellIndex]);
      } else {
        wizard.actions[action] = cyclePress(wizard.actions[action]);
      }

      if (action === 'left') {
        wizard.accelX(-boost);
        wizard.faceDir('left');
      } else if (action === 'right') {
        wizard.accelX(boost);
        wizard.faceDir('right');
      }
    } else {
      if (action.match(/spells/)) {
        spellIndex = action.slice(6);
        wizard.actions.spells[spellIndex] = cycleRelease(wizard.actions.spells[spellIndex]);
      } else {
        wizard.actions[action] = cycleRelease(wizard.actions[action]);
      }
    }
  }

};


function cyclePress(action) {
  if (action === 'none') return 'tap';

  if (action === 'tap') return 'hold';

  if (action === 'hold') return 'hold';

  if (action === 'release') return 'tap';
}

function cycleRelease(action) {
  if (action === 'none') return 'none';

  if (action === 'tap') return 'release';

  if (action === 'hold') return 'release';

  if (action === 'release') return 'none';
}

export default Player;
