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
      this.checkKeys();
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 1000/120);

    this.bindKeys();
  }

  GameView.prototype.bindKeys = function () {
    var boost = .5;
    var jump = -5;

    key('k', function(){ this.game.wizards[0].jump(jump) }.bind(this));
    key('g', function(){ this.game.wizards[1].jump(jump) }.bind(this));
    key('j', function(){ this.game.wizards[0].spell1() }.bind(this));
    key('f', function(){ this.game.wizards[1].spell1() }.bind(this));
  }

  GameView.prototype.checkKeys = function () {
    var boost = 1.0;
    if (key.isPressed('up')) {
      this.game.wizards[0].faceDir("up");
    }
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
    if (key.isPressed('k')) {
      this.game.wizards[0].dynamicJump();
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
    if (key.isPressed('g')) {
      this.game.wizards[1].dynamicJump();
    }
  }

})();
