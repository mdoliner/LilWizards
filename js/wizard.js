(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);

    this.img = new Image();
    this.img.src = options.img;

    this.friction = new LW.Coord([.85, 1]);
    this.gravity = new LW.Coord([0, 1]); //HELP ME

    this.game = options.game;


    this.collBox = new LW.CollBox(this.pos, [33, 33]);
    this.onGround = false;
  };

  Wizard.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x, this.pos.y);
  };

  Wizard.prototype.move = function () {
    this.onGround = false;
    var collisions = this.game.allCollisions(this);
    if (collisions.length !== 0 ) {
      for (var i = 0; i < collisions.length; i++) {
        if (collisions[i][0]) {
          this.vel.y = 0.1;
        }
        if (collisions[i][1]) {
          this.vel.x = -0.1;
        }
        if (collisions[i][2]) {
          this.vel.y = 0;
          this.onGround = true;
        }
        if (collisions[i][3]) {
          this.vel.x = 0.1;
        }
      }
    }
    this.pos.plus(this.vel);
    this.vel.plus(this.gravity);
    if (this.onGround) {
      this.vel.times(this.friction);
    }
    // // Stop flying for now;
    // this.pos.min([1024-this.img.width, 576-this.img.height]);
    // this.pos.max([0, 0]);
  };

  Wizard.prototype.isValidMove = function (move) {
    var currPos = this.pos.dup();
    var nextPos = currPos.plus(move);

    return this.game.isColliding(this);
  }

})();
