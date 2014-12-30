(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Sprite = LW.Sprite = function (options) {
    var defaults = {
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
      baseAngle: 0,
      sizeX: 100, //percent
      sizeY: 100, //percent
      animationReset: function () {}
    };
    for (var attrname in options) {
      if (options[attrname] !== undefined) {
        defaults[attrname] = options[attrname]; 
      } 
    }

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
    this.baseAngle = defaults.baseAngle;
    this.sizeX = defaults.sizeX; //percent
    this.sizeY = defaults.sizeY; //percent
    this.animationReset = defaults.animationReset;
  };

  Sprite.prototype.animate = function () {
    this.tickCount += 1;
    if (this.tickCount > this.buffer) {
      this.tickCount = 0;
      this.indexX += 1;
      if (this.indexX >= this.indexXMax) {
        this.indexX = 0;
        this.animationReset(this.parent);
      }
    }
  };

  Sprite.prototype.draw = function (ctx, camera) {
    ctx.save();
    var drawPos = camera.relativePos(this.pos);
    ctx.translate(drawPos.x, drawPos.y);
    if (this.mirror) {
      ctx.scale(-1,1)
    }
    ctx.rotate((this.angle - this.baseAngle) * Math.PI/180);
    var sWidth = this.img.width / this.indexXMax;
    var sHeight = this.img.height / this.indexYMax;
    ctx.drawImage(this.img,
      sWidth * this.indexX,
      sHeight * this.indexY,
      sWidth,
      sHeight,
      -sWidth * this.sizeX * camera.size / 20000,
      -sHeight * this.sizeY * camera.size / 20000,
      sWidth * this.sizeX * camera.size / 10000,
      sHeight * this.sizeY * camera.size / 10000
      );
    ctx.restore();
  };

})();
