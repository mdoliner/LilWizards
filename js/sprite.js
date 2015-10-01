(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var defaults = {
    parent: null,
    pos: null,
    img: '',
    indexX: 0,
    indexXMax: 1,
    indexY: 0,
    indexYMax: 1,
    tickCount: 0,
    buffer: 10,
    mirror: false,
    angle: 0,
    baseAngle: 0,
    sizeX: 100, //percent
    sizeY: 100, //percent
    background: false,
    opacity: 1,
    animationReset: function() {},
  };

  var Sprite = LW.Sprite = function(options) {
    var item;
    Util.extend(this, item = Util.clone(defaults), options);

    if (this.pos) {
      this.pos = new LW.Coord(this.pos);
    } else {
      this.pos = this.parent.pos;
    }

    this.img = new Image();
    this.img.src = item.img;
    if (this.load) {
      this.img.onload = function() {
        if (this.game) {
          this.game.drawAll = true;
        } else if (this.parent) {
          this.parent.game.drawAll = true;
        }
      }.bind(this);
    }
  };

  Sprite.WIZARDS = [
    './graphics/baby_wiz_cream.png',
    './graphics/baby_wiz_purple.png',
    './graphics/baby_wiz_red.png',
    './graphics/baby_wiz_green.png',
    './graphics/baby_wiz_blue.png',
  ];

  Sprite.prototype.animate = function() {
    this.tickCount += 1;
    if (this.tickCount > this.buffer) {
      this.tickCount = 0;
      this.indexX += 1;
      if (this.indexX >= this.indexXMax) {
        this.indexX = 0;
        this.animationReset();
      }
    }
  };

  Sprite.prototype.draw = function(ctx, camera) {
    ctx.save();
    var drawPos = camera.relativePos(this.pos);
    if (this.background) {
      drawPos.minus(this.pos).divided(2).plus(this.pos);
    }

    drawPos.drawRound();
    ctx.translate(drawPos.x, drawPos.y);
    if (this.mirror) {
      ctx.scale(-1, 1);
    }

    ctx.rotate((this.angle - this.baseAngle) * Math.PI / 180);
    if (ctx.globalAlpha !== this.opacity) {
      ctx.globalAlpha = this.opacity;
    }

    // Perform special rounding for speed boost and pixel clairty
    var sWidth = (this.img.width / this.indexXMax + 0.5) | 0;
    var sHeight = (this.img.height / this.indexYMax + 0.5) | 0;
    var relWidth = (sWidth * this.sizeX * camera.size / 20000 + 0.5) | 0;
    var relHeight = (sHeight * this.sizeY * camera.size / 20000 + 0.5) | 0;
    ctx.drawImage(this.img,
      sWidth * this.indexX,
      sHeight * this.indexY,
      sWidth,
      sHeight,
      -relWidth,
      -relHeight,
      relWidth * 2,
      relHeight * 2
      );
    ctx.restore();
    if (ctx.globalAlpha !== 1) {
      ctx.globalAlpha = 1;
    }
  };

})();
