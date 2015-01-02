(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CollBox = LW.CollBox = function (parent, dimension){
    this.dim = new LW.Coord(dimension);
    this.parent = parent;
    this.pos = this.parent.pos;
    this.game = this.parent.game;
  };

  CollBox.prototype.collision = function (otherObj) {
    var otherBox = otherObj.collBox;
    if (Math.abs(this.pos.x - otherBox.pos.x) < this.dim.x + otherBox.dim.x &&
        Math.abs(this.pos.y - otherBox.pos.y) < this.dim.y + otherBox.dim.y) {
      return otherObj;
    }
    return false;
  };

  CollBox.prototype.collHor = function (moveX, options) {
    this.pos.x += moveX;
    options = options || {};
    var collisions = this.game.solidCollisions(this);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthX = (this.dim.x + oB.dim.x) - Math.abs(this.pos.x - oB.pos.x);
        if (this.pos.x > oB.pos.x ) {
          this.pos.x += depthX;
          options.leftCollision && options.leftCollision();
        } else {
          this.pos.x -= depthX;
          options.rightCollision && options.rightCollision();
        }
        options.isCollision && options.isCollision();
      }
    }
    return collisions;
  };

  CollBox.prototype.collVer = function (moveY, options) {
    this.pos.y += moveY;
    options = options || {};
    var collisions = this.game.solidCollisions(this);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthY = (this.dim.y + oB.dim.y) - Math.abs(this.pos.y - oB.pos.y);
        if (this.pos.y > oB.pos.y ) {
          this.pos.y += depthY;
          options.topCollision && options.topCollision();
        } else {
          this.pos.y -= depthY;
          options.bottomCollision && options.bottomCollision();
        }
        options.isCollision && options.isCollision();
      }
    }
    return collisions;
  };

})();
