(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Sprite = LW.Sprite = function (options) {
    defaults = {
      parent: null,
      img: "",
      indexX: 0,
      indexXMax: 1,
      indexY: 0,
      indexYMax: 1,
      tickCount: 0,
      buffer: 5,
      mirror: false,
      angle: 0,
      sizeX: 100, //percent
      sizeY: 100 //percent
    }
    for (var attrname in options) { defaults[attrname] = options[attrname]; }

    this.parent = defaults.parent;
    this.pos = this.parent.pos;

    this.img = new Image();
    this.img.src = defaults.img;
    
    this.indexX = defaults.indexX;
    this.indexXMax = defaults.indexXMax;
    this.indexY = defaults.indexY;
    this.indexYMax = defaults.indexYMax;
    this.tickCount = defaults.tickCount;
    this.buffer = defaults.buffer;
    this.mirror = defaults.mirror;
    this.angle = defaults.angle;
    this.sizeX = defaults.sizeX; //percent
    this.sizeY = defaults.sizeY; //percent
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
