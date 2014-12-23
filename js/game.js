(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Game = LW.Game = function () {
    this.wizard = new LW.Wizard({
      pos: [500,256],
      vel: [0,0],
      img: "./graphics/wiz.png"
    });
  };

  Game.prototype.step = function () {
    this.wizard.move();
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0,1024,576);
    this.wizard.draw(ctx);
  };

})();
