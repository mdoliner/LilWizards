(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.Objects = {};

  var Tile = LW.Tile = function(options) {
    this.pos = new LW.Coord(options.pos);
    options.angle = options.angle || 0;
    options.dim = options.dim || [16,16];
    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this,
      baseAngle: options.angle,
      sizeY: options.dim[1] * (options.sizeYFactor || 6.25),
      sizeX: options.dim[0] * (options.sizeXFactor || 6.25),
    });

    this.collBox = new LW.CollBox(this, options.dim, options.angle);
  };

  Tile.extend = Util.fnExtend;

  Tile.prototype.draw = function(ctx, camera) {
    this.sprite.draw(ctx, camera);
  };

})();
