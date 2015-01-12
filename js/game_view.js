(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var GameView = LW.GameView = function (bgctx, fgctx) {
    this.game = new LW.Game();
    this.fgctx = fgctx;
    this.bgctx = bgctx;
    this.MS = Date.now();
    this.fps = {
      startTime : 0,
      frameNumber : 0,
      element: $('div.fps-counter'),
      getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
          currentTime = ( d - this.startTime ) / 1000,
          result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
          this.startTime = new Date().getTime();
          this.frameNumber = 0;
        }
        return result;

      } 
    };
    this.updateFPS = 0;
    this.isDrawFrame = true;
  };

  GameView.prototype.startGame = function () {
    var gameStep = function () {
      this.checkControllerActions();
      this.checkKeyActions();
      this.wizardActions();
      this.game.step();
      this.fps.element.html("FPS: "+this.fps.getFPS())
      if (this.isDrawFrame) {
        this.game.draw(this.fgctx, this.bgctx);
      }
      this.isDrawFrame = !this.isDrawFrame
    }.bind(this)
    setInterval(gameStep, 1000/120);
  };

  GameView.prototype.wizardActions = function () {
    var wizards = this.game.wizards;
    for (var i = 0; i < wizards.length; i++) {
      var wizard = wizards[i];
      if (wizard.isDead()) {continue;}
      if (wizard.actions["jump"] === "tap") {
        wizard.jump(LW.Wizard.BASEJUMP);
      }
      if (wizard.actions["jump"] === "hold") {
        wizard.dynamicJump();
      }
      if (wizard.actions["up"] === "tap") {
        wizard.faceDir("up");
      } else if (wizard.actions["up"] === "release") {
        wizard.verFacing = null;
      }
      if (wizard.actions["down"] === "tap") {
        wizard.faceDir("down");
      } else if (wizard.actions["down"] === "release") {
        wizard.verFacing = null;
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
    var boost = LW.Wizard.BASEBOOST;
    for (var i = 0; i < gamepads.length; i++) {
      var leftX = Gamepad.moved(i, "LEFT_X")
      if (Gamepad.pressed(i, "PAD_LEFT") || leftX < 0) {
        this.game.wizards[i].accelX(leftX * boost || -boost);
        this.game.wizards[i].faceDir("left");
      }
      if (Gamepad.pressed(i, "PAD_RIGHT") || leftX > 0) {
        this.game.wizards[i].accelX(leftX * boost || boost);
        this.game.wizards[i].faceDir("right");
      }
      var leftY = Gamepad.moved(i, "LEFT_Y")
      if (Gamepad.pressed(i, "PAD_UP") || leftY < -0.5) {
        this.game.wizards[i].actions["up"] = this.cyclePress(this.game.wizards[i].actions["up"]);
      } else {
        this.game.wizards[i].actions["up"] = this.cycleRelease(this.game.wizards[i].actions["up"]);
      }
      if (Gamepad.pressed(i, "PAD_DOWN") || leftY > 0.5) {
        this.game.wizards[i].actions["down"] = this.cyclePress(this.game.wizards[i].actions["down"]);
      } else {
        this.game.wizards[i].actions["down"] = this.cycleRelease(this.game.wizards[i].actions["down"]);
      }
      if (Gamepad.pressed(i, "FACE_1") || Gamepad.pressed(i, "LEFT_SHOULDER")) {
        this.game.wizards[i].actions["jump"] = this.cyclePress(this.game.wizards[i].actions["jump"]);
      } else {
        this.game.wizards[i].actions["jump"] = this.cycleRelease(this.game.wizards[i].actions["jump"]);
      }
      if (Gamepad.pressed(i, "FACE_2") || Gamepad.pressed(i, "LEFT_SHOULDER_BOTTOM")) {
        this.game.wizards[i].actions["spells"][0] = this.cyclePress(this.game.wizards[i].actions["spells"][0]);
      } else {
        this.game.wizards[i].actions["spells"][0] = this.cycleRelease(this.game.wizards[i].actions["spells"][0]);
      }
      if (Gamepad.pressed(i, "FACE_3") || Gamepad.pressed(i, "RIGHT_SHOULDER")) {
        this.game.wizards[i].actions["spells"][1] = this.cyclePress(this.game.wizards[i].actions["spells"][1]);
      } else {
        this.game.wizards[i].actions["spells"][1] = this.cycleRelease(this.game.wizards[i].actions["spells"][1]);
      }
      if (Gamepad.pressed(i, "FACE_4") || Gamepad.pressed(i, "RIGHT_SHOULDER_BOTTOM")) {
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
    var boost = LW.Wizard.BASEBOOST;
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
    }
  };


})();
