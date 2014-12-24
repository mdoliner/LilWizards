(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);

    this.img = new Image();
    this.img.src = options.img;

    this.friction = new LW.Coord([.870, 1]);
    this.gravity = new LW.Coord([0, 0.17]); //HELP ME

    this.game = options.game;


    this.collBox = new LW.CollBox(this.pos, [16, 16]);
    this.onGround = false;
  };

  Wizard.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x-16, this.pos.y-16);
  };

  Wizard.prototype.move = function () {
    this.onGround = false;

    this.pos.x += this.vel.x;
    var collisions = this.game.allCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i];
        var depthX = (this.collBox.dim[0] + oB.dim[0]) - Math.abs(this.pos.x - oB.pos.x);
        if (this.pos.x > oB.pos.x ) {
          this.pos.x += depthX;
        } else {
          this.pos.x -= depthX;
        }
        this.vel.x = 0;
      }
    }

    this.pos.y += this.vel.y;
    var collisions = this.game.allCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i];
        var depthY = (this.collBox.dim[1] + oB.dim[1]) - Math.abs(this.pos.y - oB.pos.y);
        if (this.pos.y > oB.pos.y ) {
          this.pos.y += depthY;
        } else {
          this.pos.y -= depthY;
          this.onGround = true;
        }
        this.vel.y = 0.1;
      }
    }

    if (!this.onGround) {
      this.vel.plus(this.gravity);
    } else {
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
  };

  Wizard.prototype.jump = function (val) {
    if (this.onGround) {
      this.vel.y = val;
    }
  };

  Wizard.prototype.accelX = function (val) {
    if (!this.onGround) {
      val /= 3.5;
    }
    if (Math.abs(this.vel.x + val) < 5) {
      this.vel.x += val;
    }
  };

})();
