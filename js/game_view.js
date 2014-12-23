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
    }.bind(this), 1000/60);

    this.bindKeys();
  }

  GameView.prototype.bindKeys = function () {
    var boost = .5;
    var jump = -10;

    key('up', function(){ this.game.wizard.vel.y = jump }.bind(this));
    key('d', function(){ this.game.wizard.vel.x = 80 }.bind(this));
    // key('left', function(){ this.game.wizard.vel.plus([-boost, 0])}.bind(this));
    // key('right', function(){ this.game.wizard.vel.plus([boost, 0])}.bind(this));
  }

  GameView.prototype.checkKeys = function () {
    var boost = .5;
    if (key.isPressed('left')) { this.game.wizard.vel.plus([-boost, 0]);}
    if (key.isPressed('right')) { this.game.wizard.vel.plus([boost, 0]);}
  }

})();
