(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Sprite = LW.Sprite = function (options) {
    this.img = new Image();
    this.img = options.img;
    this.indexX = 0;
    this.indexY = 0;
    this.tickCount = 0;
    this.buffer = 5;
  };

  Sprite.prototype.animate = function () {
    this.tickCount += 1;

    if (this.tickCount > this.buffer) {
      this.tickCount = 0;

    }
  };

  Sprite.prototype.draw = function (ctx, x, y) {

  };

})();
