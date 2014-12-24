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
    var jump = -7;

    key('up', function(){ this.game.wizards[0].jump(jump) }.bind(this));
    key('w', function(){ this.game.wizards[1].jump(jump) }.bind(this));
  }

  GameView.prototype.checkKeys = function () {
    var boost = 1.0;
    if (key.isPressed('left')) { this.game.wizards[0].accelX(-boost);}
    if (key.isPressed('right')) { this.game.wizards[0].accelX(boost);}
    if (key.isPressed('a')) { this.game.wizards[1].accelX(-boost);}
    if (key.isPressed('d')) { this.game.wizards[1].accelX(boost);}
  }

})();
