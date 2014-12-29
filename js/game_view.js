(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var GameView = LW.GameView = function (ctx) {
    this.game = new LW.Game();
    this.ctx = ctx;
  };

  GameView.prototype.startGame = function () {
    setInterval(function () {
      this.checkControllerActions();
      this.checkKeyActions();
      this.wizardActions();
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 1000/120);

    // this.bindKeys();
  };

  GameView.prototype.bindKeys = function () {
    var boost = .5;
    var jump = -5;

    key('p', function(){ this.game.wizards[0].jump(jump) }.bind(this));
    key('f', function(){ this.game.wizards[1].jump(jump) }.bind(this));
  };

  GameView.prototype.checkKeys = function () {
    var boost = 1.0;
    if (key.isPressed('left')) {
      this.game.wizards[0].accelX(-boost);
      this.game.wizards[0].faceDir("left");
    }
    if (key.isPressed('right')) {
      this.game.wizards[0].accelX(boost);
      this.game.wizards[0].faceDir("right");
    }
    if (key.isPressed('down')) {
      this.game.wizards[0].faceDir("down");
    }
    if (key.isPressed('up')) {
      this.game.wizards[0].faceDir("up");
    }
    if (key.isPressed('p')) {
      this.game.wizards[0].dynamicJump();
    }
    if (key.isPressed('o')) {
      this.game.wizards[0].castSpell(0);
    }
    if (key.isPressed('i')) {
      this.game.wizards[0].castSpell(1);
    }
    if (key.isPressed('u')) {
      this.game.wizards[0].castSpell(2);
    }


    if (key.isPressed('a')) {
      this.game.wizards[1].accelX(-boost);
      this.game.wizards[1].faceDir("left");
    }
    if (key.isPressed('d')) {
      this.game.wizards[1].accelX(boost);
      this.game.wizards[1].faceDir("right");
    }
    if (key.isPressed('w')) {
      this.game.wizards[1].faceDir("up");
    }
    if (key.isPressed('s')) {
      this.game.wizards[1].faceDir("down");
    }
    if (key.isPressed('f')) {
      this.game.wizards[1].dynamicJump();
    }
    if (key.isPressed('g')) {
      this.game.wizards[1].castSpell(0);
    }
    if (key.isPressed('h')) {
      this.game.wizards[1].castSpell(1);
    }
    if (key.isPressed('j')) {
      this.game.wizards[1].castSpell(2);
    }
  };

  GameView.prototype.checkControllers = function () {
    var gamepads = Gamepad.gamepads;
    for (var i = 0; i < gamepads.length; i++) {
      var leftX = Gamepad.moved(i, "LEFT_X")
      if (Gamepad.pressed(i, "PAD_LEFT") || leftX < 0) {
        this.game.wizards[i].accelX(leftX || -1);
        this.game.wizards[i].faceDir("left");
      }
      if (Gamepad.pressed(i, "PAD_RIGHT") || leftX > 0) {
        this.game.wizards[i].accelX(leftX || 1);
        this.game.wizards[i].faceDir("right");
      }
      var leftY = Gamepad.moved(i, "LEFT_Y")
      if (Gamepad.pressed(i, "PAD_UP") || leftY < -0.5) {
        this.game.wizards[i].faceDir("up");
      }
      if (Gamepad.pressed(i, "PAD_DOWN") || leftY > 0.5) {
        this.game.wizards[i].faceDir("down");
      }
      if (Gamepad.pressed(i, "FACE_1")) {
        this.game.wizards[i].jump(-5);
        this.game.wizards[i].dynamicJump();
      }
      if (Gamepad.pressed(i, "FACE_2")) {
        this.game.wizards[i].castSpell(0);
      }
      if (Gamepad.pressed(i, "FACE_3")) {
        this.game.wizards[i].castSpell(1);
      }
      if (Gamepad.pressed(i, "FACE_4")) {
        this.game.wizards[i].castSpell(2);
      }
    }
  };

  GameView.prototype.wizardActions = function () {
    var wizards = this.game.wizards;
    for (var i = 0; i < wizards.length; i++) {
      var wizard = wizards[i];
      if (wizard.actions["jump"] === "tap") {
        wizard.jump(-5);
      }
      if (wizard.actions["jump"] === "hold") {
        wizard.dynamicJump();
      }
      for (var spellIndex = 0; spellIndex < wizard.actions["spells"].length; spellIndex ++) {
        if (wizard.actions["spells"][spellIndex] === "tap") {
          wizard.castSpell(spellIndex);
        }
      }
    }
  };

  GameView.prototype.checkControllerActions = function () {
    var gamepads = Gamepad.gamepads;
    for (var i = 0; i < gamepads.length; i++) {
      var leftX = Gamepad.moved(i, "LEFT_X")
      if (Gamepad.pressed(i, "PAD_LEFT") || leftX < 0) {
        this.game.wizards[i].accelX(leftX || -1);
        this.game.wizards[i].faceDir("left");
      }
      if (Gamepad.pressed(i, "PAD_RIGHT") || leftX > 0) {
        this.game.wizards[i].accelX(leftX || 1);
        this.game.wizards[i].faceDir("right");
      }
      var leftY = Gamepad.moved(i, "LEFT_Y")
      if (Gamepad.pressed(i, "PAD_UP") || leftY < -0.5) {
        this.game.wizards[i].faceDir("up");
      }
      if (Gamepad.pressed(i, "PAD_DOWN") || leftY > 0.5) {
        this.game.wizards[i].faceDir("down");
      }
      if (Gamepad.pressed(i, "FACE_1")) {
        this.game.wizards[i].actions["jump"] = this.cyclePress(this.game.wizards[i].actions["jump"]);
      } else {
        this.game.wizards[i].actions["jump"] = this.cycleRelease(this.game.wizards[i].actions["jump"]);
      }
      if (Gamepad.pressed(i, "FACE_2")) {
        this.game.wizards[i].actions["spells"][0] = this.cyclePress(this.game.wizards[i].actions["spells"][0]);
      } else {
        this.game.wizards[i].actions["spells"][0] = this.cycleRelease(this.game.wizards[i].actions["spells"][0]);
      }
      if (Gamepad.pressed(i, "FACE_3")) {
        this.game.wizards[i].actions["spells"][1] = this.cyclePress(this.game.wizards[i].actions["spells"][1]);
      } else {
        this.game.wizards[i].actions["spells"][1] = this.cycleRelease(this.game.wizards[i].actions["spells"][1]);
      }
      if (Gamepad.pressed(i, "FACE_4")) {
        this.game.wizards[i].actions["spells"][2] = this.cyclePress(this.game.wizards[i].actions["spells"][2]);
      } else {
        this.game.wizards[i].actions["spells"][2] = this.cycleRelease(this.game.wizards[i].actions["spells"][2]);
      }
    }
  };

  GameView.prototype.cyclePress = function (action) {
    if (action === "none") {return "tap"};
    if (action === "tap") {return "hold"};
    if (action === "hold") {return "hold"};
    if (action === "release") {return "tap"};
  };

  GameView.prototype.cycleRelease = function (action) {
    if (action === "none") {return "none"};
    if (action === "tap") {return "release"};
    if (action === "hold") {return "release"};
    if (action === "release") {return "none"};
  };

  var controlScheme = [{
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

  GameView.prototype.checkKeyActions = function () {
    var boost = 1.0;
    for (var i = 0; i < 2; i++) {
      var wizard = this.game.wizards[i + Gamepad.gamepads.length];
      var buttons = controlScheme[i];
      if (key.isPressed(buttons["left"])) {
        wizard.accelX(-boost);
        wizard.faceDir("left");
      }
      if (key.isPressed(buttons['right'])) {
        wizard.accelX(boost);
        wizard.faceDir("right");
      }
      if (key.isPressed(buttons['down'])) {
        wizard.faceDir("down");
      }
      if (key.isPressed(buttons['up'])) {
        wizard.faceDir("up");
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
    }
  };


})();
