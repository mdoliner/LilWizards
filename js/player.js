(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.KeyboardControlScheme = [{
    up: "up",
    right: "right",
    down: "down",
    left: "left",
    jump: "p",
    spells: ["o", "i", "u"]
  }, {
    up: "w",
    right: "d",
    down: "s",
    left: "a",
    jump: "f",
    spells: ["g", "h", "j"]
  }];

  LW.Players = [];

  var PseudoWizard = LW.PseudoWizard = function () {
    this.actions = { // none, tap, hold, release
      jump: "none",
      spells: ["none", "none", "none"],
      left: "none",
      right: "none",
      up: "none",
      down: "none"
    };
  };

  PseudoWizard.prototype.accelX = function () {};

  PseudoWizard.prototype.faceDir = function () {};

  var Player = LW.Player = function (options) {
  	this.controllerType = options.controllerType; // "keyboard" or "gamepad"
  	this.controllerIndex = options.controllerIndex;
  	this.spellList = options.spellList || [null, null, null];
  	this.wizardGraphic = "./graphics/wiz_baby_ani_2.png";
  	this.wizard = options.wizard || null;
  };

  Player.prototype.makeWizard = function (options) {
  	return this.wizard = new LW.Wizard({
      pos: options.game.getSpawnPointPos(),
      vel: [0,0],
      horFacing: "left",
      img: this.wizardGraphic,
      imgIndexXMax: 4,
      imgIndexYMax: 4,
      imgSizeX: 7.62,
      imgSizeY: 8,
      spellList: this.makeSpellList(),
      game: options.game
    });
  };

  Player.prototype.makeSpellList = function () {
    var spells = [];
    this.spellList.forEach(function (spellName) {
      spells.push(LW.SpellList[spellName]);
    });
    return spells;
  };

  Player.randomSpellList = function () {
    var spells = [];
    while (spells.length < 3) {
      var spell = LW.Spell.TOTAL_SPELL_NAMES[Math.floor(Math.random() * LW.Spell.TOTAL_SPELL_NAMES.length)];
      if (spells.indexOf(spell) === -1) {
        spells.push(spell);
      }
    }
    return spells;
  };

  Player.prototype.checkControllerActions = function () {
  	if (!this.wizard) { return }
  	if (this.controllerType === "keyboard") {
  		this.checkKeyboardActions();
  	} else if (this.controllerType === "gamepad") {
  		this.checkGamepadActions();
  	} else if (this.controllerType === "computer") {
      this.checkComputerActions();
    } else {
  		console.log('player aint got a controllerType');
  	}
  };

  Player.prototype.cyclePress = function (action) {
    if (action === "none") {return "tap"};
    if (action === "tap") {return "hold"};
    if (action === "hold") {return "hold"};
    if (action === "release") {return "tap"};
  };

  Player.prototype.cycleRelease = function (action) {
    if (action === "none") {return "none"};
    if (action === "tap") {return "release"};
    if (action === "hold") {return "release"};
    if (action === "release") {return "none"};
  };

  Player.prototype.checkGamepadActions = function () {
    var boost = LW.Wizard.BASEBOOST;
    var i = this.controllerIndex;
    var leftX = Gamepad.moved(i, "LEFT_X")
    if (Gamepad.pressed(i, "PAD_LEFT") || leftX < 0) {
      this.wizard.accelX(leftX * boost || -boost);
      this.wizard.faceDir("left");
      this.wizard.actions["left"] = this.cyclePress(this.wizard.actions["left"]);
    } else {
    	this.wizard.actions["left"] = this.cycleRelease(this.wizard.actions["left"]);
    }
    if (Gamepad.pressed(i, "PAD_RIGHT") || leftX > 0) {
      this.wizard.accelX(leftX * boost || boost);
      this.wizard.faceDir("right");
    	this.wizard.actions["right"] = this.cyclePress(this.wizard.actions["right"]);
    } else {
    	this.wizard.actions["right"] = this.cycleRelease(this.wizard.actions["right"]);
    }
    var leftY = Gamepad.moved(i, "LEFT_Y")
    if (Gamepad.pressed(i, "PAD_UP") || leftY < -0.5) {
      this.wizard.actions["up"] = this.cyclePress(this.wizard.actions["up"]);
    } else {
      this.wizard.actions["up"] = this.cycleRelease(this.wizard.actions["up"]);
    }
    if (Gamepad.pressed(i, "PAD_DOWN") || leftY > 0.5) {
      this.wizard.actions["down"] = this.cyclePress(this.wizard.actions["down"]);
    } else {
      this.wizard.actions["down"] = this.cycleRelease(this.wizard.actions["down"]);
    }
    if (Gamepad.pressed(i, "FACE_1") || Gamepad.pressed(i, "LEFT_SHOULDER")) {
      this.wizard.actions["jump"] = this.cyclePress(this.wizard.actions["jump"]);
    } else {
      this.wizard.actions["jump"] = this.cycleRelease(this.wizard.actions["jump"]);
    }
    if (Gamepad.pressed(i, "FACE_3") || Gamepad.pressed(i, "RIGHT_SHOULDER")) {
      this.wizard.actions["spells"][0] = this.cyclePress(this.wizard.actions["spells"][0]);
    } else {
      this.wizard.actions["spells"][0] = this.cycleRelease(this.wizard.actions["spells"][0]);
    }
    if (Gamepad.pressed(i, "FACE_4") || Gamepad.pressed(i, "LEFT_SHOULDER_BOTTOM")) {
      this.wizard.actions["spells"][1] = this.cyclePress(this.wizard.actions["spells"][1]);
    } else {
      this.wizard.actions["spells"][1] = this.cycleRelease(this.wizard.actions["spells"][1]);
    }
    if (Gamepad.pressed(i, "FACE_2") || Gamepad.pressed(i, "RIGHT_SHOULDER_BOTTOM")) {
      this.wizard.actions["spells"][2] = this.cyclePress(this.wizard.actions["spells"][2]);
    } else {
      this.wizard.actions["spells"][2] = this.cycleRelease(this.wizard.actions["spells"][2]);
    }
  };

  Player.prototype.checkKeyboardActions = function () {
    var boost = LW.Wizard.BASEBOOST;
    var wizard = this.wizard;
    var buttons = LW.KeyboardControlScheme[this.controllerIndex];
    if (key.isPressed(buttons["left"])) {
    	wizard.actions["left"] = this.cyclePress(wizard.actions["left"]);
      wizard.accelX(-boost);
      wizard.faceDir("left");
    } else {
    	wizard.actions["left"] = this.cycleRelease(wizard.actions["left"]);
    }
    if (key.isPressed(buttons['right'])) {
    	wizard.actions["right"] = this.cyclePress(wizard.actions["right"]);
      wizard.accelX(boost);
      wizard.faceDir("right");
    } else {
    	wizard.actions["right"] = this.cycleRelease(wizard.actions["right"]);
    }
    if (key.isPressed(buttons['down'])) {
      wizard.actions["down"] = this.cyclePress(wizard.actions["down"]);
    } else {
      wizard.actions["down"] = this.cycleRelease(wizard.actions["down"]);
    }
    if (key.isPressed(buttons['up'])) {
      wizard.actions["up"] = this.cyclePress(wizard.actions["up"]);
    } else {
      wizard.actions["up"] = this.cycleRelease(wizard.actions["up"]);
    }
    if (key.isPressed(buttons["jump"])) {
      wizard.actions["jump"] = this.cyclePress(wizard.actions["jump"]);
    } else {
      wizard.actions["jump"] = this.cycleRelease(wizard.actions["jump"]);
    }
    for (var spellIndex = 0; spellIndex < wizard.actions["spells"].length; spellIndex++) {
      if (key.isPressed(buttons["spells"][spellIndex])) {
        wizard.actions["spells"][spellIndex] = this.cyclePress(wizard.actions["spells"][spellIndex]);
      } else {
        wizard.actions["spells"][spellIndex] = this.cycleRelease(wizard.actions["spells"][spellIndex]);
      }
    }
  };

  var COMPUTER_ACTIONS = ["up", "down", "left", "right", "jump", "spells0", "spells1", "spells2"];

  Player.prototype.checkComputerActions = function () {
    this.heldButtons = this.heldButtons || [];
    this.actionTimer = this.actionTimer - 1 || 60;
    var boost = LW.Wizard.BASEBOOST;
    var actionIndex = Math.floor(Math.random() * COMPUTER_ACTIONS.length);
    var wizard = this.wizard;

    if (this.actionTimer < 2) {
      this.heldButtons.push(COMPUTER_ACTIONS[actionIndex]);
      if (this.heldButtons.length > 3) {
        this.heldButtons.shift();
      }
    }

    // TODO: Fix this code.

    for (var i = 0; i < COMPUTER_ACTIONS.length; i++) {
      var action = COMPUTER_ACTIONS[i];
      if (this.heldButtons.indexOf(action) !== -1) {
        if (action.match(/spells/)) {
          wizard.actions["spells"][actionIndex-5] = this.cyclePress(wizard.actions["spells"][actionIndex-5]);
        } else {
          wizard.actions[action] = this.cyclePress(wizard.actions[action]);
        }
        if (action === "left") {
          wizard.accelX(-boost);
          wizard.faceDir("left");
        } else if (action === "right") {
          wizard.accelX(boost);
          wizard.faceDir("right");
        }
      } else {
        if (action.match(/spells/)) {
          wizard.actions["spells"][actionIndex-5] = this.cycleRelease(wizard.actions["spells"][actionIndex-5]);
        } else {
          wizard.actions[action] = this.cycleRelease(wizard.actions[action]);
        }
      }
    }

    // if (actionIndex > 4) {
    //   if (this.heldButtons.indexOf(wizard.actions["spells"][actionIndex - 5]) === -1) {
    //     if (this.heldButtons.length === 3) {
    //       wizard.releasePress(this.heldButtons.shift());
    //       this.heldButtons.push(COMPUTER_ACTIONS[actionIndex]);
    //     }
    //   } 
    //   wizard.actions["spells"][actionIndex - 5] = this.cyclePress(wizard.actions["spells"][actionIndex - 5]); 
    // } else {
    //   if (this.heldButtons.indexOf(wizard.actions[COMPUTER_ACTIONS[actionIndex]]) === -1) {
    //     if (this.heldButtons.length === 3) {
    //       wizard.actions[this.cycleRelease(wizard.actions[this.heldButtons.shift()]);
    //       this.heldButtons.push(COMPUTER_ACTIONS[actionIndex]);
    //     }
    //   }
    //   wizard.actions[COMPUTER_ACTIONS[actionIndex]] = this.cyclePress(wizard.actions[COMPUTER_ACTIONS[actionIndex]]);
    // }

  };

})();