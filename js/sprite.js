(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Sprite = LW.Sprite = function (options) {
    this.parent = options.parent;
    this.pos = this.parent.pos;
    this.img = new Image();
    this.img.src = options.img;
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

  Sprite.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x-this.img.width/2, this.pos.y-this.img.height/2);
  };

})();
