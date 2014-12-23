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
      this.game.step();
      this.game.draw(this.ctx);
    }.bind(this), 1000/60);

    this.bindKeys();
  }

  GameView.prototype.bindKeys = function () {
    key('up', function(){ this.game.wizard.vel.y = -10 }.bind(this));
    key('left', function(){ this.game.wizard.vel.plus([-1, 0])}.bind(this));
    key('right', function(){ this.game.wizard.vel.plus([1, 0])}.bind(this));
  }

})();
