(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var GameView = LW.GameView = function (ctx) {
    this.game = new LW.Game();
    this.ctx = ctx;
  }

  GameView.prototype.startGame = function () {
    setInterval(function () {
      this.checkControllers();
      this.checkKeys();
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 1000/120);

    this.bindKeys();
  }

  GameView.prototype.bindKeys = function () {
    var boost = .5;
    var jump = -5;

    key('p', function(){ this.game.wizards[0].jump(jump) }.bind(this));
    key('f', function(){ this.game.wizards[1].jump(jump) }.bind(this));
  }

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
  }

  GameView.prototype.checkControllers = function () {
    var gamepads = Gamepad.gamepads;
    for (var i = 0; i < gamepads.length; i++) {
      if (Gamepad.pressed(i, "PAD_LEFT")) {
        this.game.wizards[i].accelX(-1);
        this.game.wizards[i].faceDir("left");
      }
      if (Gamepad.pressed(i, "PAD_RIGHT")) {
        this.game.wizards[i].accelX(1);
        this.game.wizards[i].faceDir("right");
      }
      if (Gamepad.pressed(i, "PAD_UP")) {
        this.game.wizards[i].faceDir("up");
      }
      if (Gamepad.pressed(i, "PAD_DOWN")) {
        this.game.wizards[i].faceDir("down");
      }
      if (Gamepad.pressed(i, "FACE_1")) {
        this.game.wizards[i].dynamicJump();
        this.game.wizards[i].jump(-5);
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
  }

})();
