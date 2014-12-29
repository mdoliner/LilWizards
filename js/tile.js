(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Tile = LW.Tile = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this
    });

    this.collBox = new LW.CollBox(this.pos, [16, 16]);
  };

  Tile.prototype.draw = function (ctx) {
    this.sprite.draw(ctx);
  };

})();
