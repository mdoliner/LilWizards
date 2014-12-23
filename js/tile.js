(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Tile = LW.Tile = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.img = new Image();
    this.img.src = options.img;

    this.collBox = new LW.CollBox(this.pos, [32, 32]);
  };

  Tile.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
  };

})();
