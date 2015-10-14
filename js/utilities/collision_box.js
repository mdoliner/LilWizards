(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CollBox = LW.CollBox = function(parent, dimension, angle) {
    this.dim = new LW.Coord(dimension);
    this.parent = parent;
    this.pos = this.parent.pos;
    this.game = this.parent.game;
    this.angle = angle || 0;
  };

  CollBox.prototype.getRect = function() {
    return new LW.Rectangle({
      x: this.pos.x - this.dim.x,
      y: this.pos.y - this.dim.y,
      width: this.dim.x * 2,
      height: this.dim.y * 2,
      angle: this.angle,
      parent: this,
    });
  };

  CollBox.prototype.collisionRect = function(otherObj) {
    return this.getRect().collision(otherObj.getRect()) ? otherObj : false;

    // var otherBox = otherObj.collBox;
    // var otherRect = otherBox.getRect();
    // var thisRect = this.getRect();
    //
    // var axis = thisRect.getAxis();
    // if (!thisRect.sharesAxisWith(otherRect)) {
    //   axis = axis.concat(otherRect.getAxis());
    // }
    //
    // var thisRectProj;
    // var otherRectProj;
    // for (var i = 0; i < axis.length; i++) {
    //   thisRectProj = thisRect.getProjectionOntoAxis(axis[i]);
    //   otherRectProj = otherRect.getProjectionOntoAxis(axis[i]);
    //   if (thisRectProj.max < otherRectProj.min || otherRectProj.min < thisRectProj.max) return false;
    // }
    // return otherObj;
  };

  CollBox.prototype.collision = function(otherObj) {
    var otherBox = otherObj.collBox;
    if (otherBox.angle === 0 && this.angle === 0) {
      if (Math.abs(this.pos.x - otherBox.pos.x) < this.dim.x + otherBox.dim.x &&
        Math.abs(this.pos.y - otherBox.pos.y) < this.dim.y + otherBox.dim.y) {
        return otherObj;
      }

      return false;
    } else {
      var myAxisOther = otherBox.newAxis(this.pos, this.angle);
      var myAxisOtherDim = myAxisOther.maxDim();
      var otherAxisMe = this.newAxis(otherBox.pos, otherBox.angle);
      var otherAxisMeDim = otherAxisMe.maxDim();
      if (Math.abs(myAxisOther.pos.x) < this.dim.x + myAxisOtherDim.x &&
          Math.abs(myAxisOther.pos.y) < this.dim.y + myAxisOtherDim.y &&
          Math.abs(otherAxisMe.pos.x) < otherBox.dim.x + otherAxisMeDim.x &&
          Math.abs(otherAxisMe.pos.y) < otherBox.dim.y + otherAxisMeDim.y) {
        return otherObj;
      }

      return false;
    }
  };

  CollBox.prototype.maxDim = function() {
    var axis1 = new LW.Coord([this.dim.x, 0]);
    var axis2 = new LW.Coord([0, this.dim.y]);
    axis1.plusAngleDeg(this.angle).makeAbs();
    axis2.plusAngleDeg(this.angle).makeAbs();
    return new LW.Coord([Math.max(axis1.x, axis2.x), Math.max(axis1.y, axis2.y)]);
  };

  CollBox.prototype.removeCollision = function(dir, move, options) {
    // TODO: this function doesn't have a case for if an angle box is hitting a solid object
    options = options || {};
    this.pos[dir] += move;
    var collisions = this.game.solidCollisions(this);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var collision = collisions[i];
        var oB = collision.collBox;
        var depth;

        // If the other collision box is not angled, handle it simply.
        if (oB.angle === 0) {
          depth = (this.dim[dir] + oB.dim[dir]) - Math.abs(this.pos[dir] - oB.pos[dir]);
          if (Math.abs(depth) > 60) debugger;
          if (this.pos[dir] > oB.pos[dir]) {
            this.pos[dir] += depth;
            options.leftCollision && options.leftCollision(collision);
            options.topCollision && options.topCollision();
          } else {
            this.pos[dir] -= depth;
            options.rightCollision && options.rightCollision(collision);
            options.bottomCollision && options.bottomCollision();
          }
        } else {
          console.error('not implemented');
        }

        options.isCollision && options.isCollision();
      }
    }

    return collisions;
  };

  CollBox.prototype.newAxis = function(startPos, startAngle) {
    var newMe = new LW.CollBox(this.parent, this.dim.dup(), this.angle - startAngle);
    newMe.pos = this.pos.dup().minus(startPos).plusAngleDeg(-startAngle);
    return newMe;
  };

  // Debug Function:
  CollBox.prototype.draw = function(ctx, camera, color) {
    ctx.save();
    var drawPos = camera.relativePos(this.pos);
    ctx.translate(drawPos.x, drawPos.y);
    ctx.rotate((this.angle) * Math.PI / 180);
    ctx.beginPath();
    ctx.rect(
      -this.dim.x,
      -this.dim.y,
      this.dim.x * camera.size / 100 * 2,
      this.dim.y * camera.size / 100 * 2
    );
    ctx.fillStyle = color || 'white';
    ctx.fill();
    ctx.restore();
  };

})();
