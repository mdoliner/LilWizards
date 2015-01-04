(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Tile = LW.Tile = function (options) {
    this.pos = new LW.Coord(options.pos);
    options.angle = options.angle || 0;
    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this,
      baseAngle: options.angle
    });

    this.collBox = new LW.CollBox(this, [16, 16], options.angle);
  };

  Tile.prototype.draw = function (ctx, camera) {
    this.sprite.draw(ctx, camera);
  };

})();
