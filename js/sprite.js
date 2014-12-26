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
    this.indexXMax = 1;
    this.indexY = 0;
    this.indexYMax = 1;
    this.tickCount = 0;
    this.buffer = 5;
    this.mirror = false;
    this.angle = 0;
    this.sizeX = 100; //percent
    this.sizeY = 100; //percent
  };

  Sprite.prototype.animate = function () {
    this.tickCount += 1;
    if (this.tickCount > this.buffer) {
      this.tickCount = 0;
    }
  };

  Sprite.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    if (this.mirror) {
      ctx.scale(-1,1)
    }
    ctx.rotate(this.angle * Math.PI/180);
    var sWidth = this.img.width / this.indexXMax;
    var sHeight = this.img.height / this.indexYMax;
    ctx.drawImage(this.img,
      sWidth * this.indexX,
      sHeight * this.indexY,
      sWidth,
      sHeight,
      -sWidth * this.sizeX / 200,
      -sHeight * this.sizeY / 200,
      sWidth * this.sizeX / 100,
      sHeight * this.sizeY / 100
      );
    ctx.restore();
  };

})();
