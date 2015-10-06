(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.Objects = {};

  var Tile = LW.Tile = function(options) {
    this.pos = new LW.Coord(options.pos);
    options.angle = options.angle || 0;
    options.dim = options.dim || this.dim;
    this.sprite = new LW.Sprite({
      img: options.img != null ? options.img : this.img,
      parent: this,
      baseAngle: options.angle,
      sizeY: (this.sizeY || options.dim[1]) * (options.sizeYFactor || 6.25),
      sizeX: (this.sizeX || options.dim[0]) * (options.sizeXFactor || 6.25),
    });

    this.collBox = new LW.CollBox(this, options.dim, options.angle);
    this.initialize(options);
  };

  Tile.extend = Util.fnExtend;

  Tile.prototype.initialize = function() {};

  Tile.prototype.dim = [16, 16];
  Tile.prototype.sizeX = null;
  Tile.prototype.sizeY = null;

  Tile.prototype.draw = function(ctx, camera) {
    this.sprite.draw(ctx, camera);
  };

})();
