(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);

    this.img = new Image();
    this.img.src = options.img;

    this.friction = new LW.Coord([.99, 1]);
    this.gravity = new LW.Coord([0, 1]);
  };

  Wizard.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
  };

  Wizard.prototype.move = function () {
    var prevY = this.pos.y;
    this.pos.plus(this.vel);
    this.vel.times(this.friction);
    this.vel.plus(this.gravity);
    // Stop flying for now;
    this.pos.min([1024-this.img.width, 576-this.img.height]);
    this.pos.max([0, 0]);
  };

})();
