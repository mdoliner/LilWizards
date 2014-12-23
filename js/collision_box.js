(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CollBox = LW.CollBox = function (pos, dimension){
    this.dim = dimension;
    this.pos = pos;
    this.topRight = this.pos.dup().plus([this.dim[0], 0]);
    this.bottomLeft = this.pos.dup().plus([0, this.dim[1]]);
    this.bottomRight = this.pos.dup().plus(this.dim);
  };

  CollBox.prototype.totalCollision = function (otherBox) {
    var top = this.isCollidedOnTop(otherBox);
    var right = this.isCollidedOnRight(otherBox);
    var bottom = this.isCollidedOnBottom(otherBox);
    var left = this.isCollidedOnLeft(otherBox);

    if (!top && !right && !bottom && !left) {
      return false;
    } else {
      return [top, right, bottom, left];
    }
  }

  CollBox.prototype.bottomRightColl = function (otherBox) {
    if (this.bottomRight.y > otherBox.pos.y &&
      this.bottomRight.x > otherBox.pos.x &&
      this.bottomRight.y < otherBox.bottomRight.y &&
      this.bottomRight.x < otherBox.bottomRight.x
      ) {
        console.log("compare these");
        console.log(this.bottomRight);
        console.log(otherBox.pos);
        console.log("and these");
        console.log(this.bottomRight);
        console.log(otherBox.bottomRight);
      return true;
    }
    return false;
  };

  CollBox.prototype.bottomLeftColl = function (otherBox) {
    if (this.bottomLeft.y > otherBox.topRight.y &&
      this.bottomLeft.x < otherBox.topRight.x &&
      this.bottomLeft.y < otherBox.bottomLeft.y &&
      this.bottomLeft.x > otherBox.bottomLeft.x
      ) {
      return true;
    }
    return false;
  }

  CollBox.prototype.topRightColl = function (otherBox) {
    if (this.topRight.y < otherBox.bottomLeft.y &&
      this.topRight.x > otherBox.bottomLeft.x &&
      this.topRight.y > otherBox.topRight.y &&
      this.topRight.x < otherBox.topRight.x) {
      return true;
    }
    return false;
  }

  CollBox.prototype.topLeftColl = function (otherBox) {
    if (this.pos.y < otherBox.bottomRight.y &&
      this.pos.x < otherBox.bottomRight.x &&
      this.pos.x > otherBox.pos.x &&
      this.pos.y > otherBox.pos.y) {
      return true;
    }
    return false;
  }

  CollBox.prototype.isCollidedOnTop = function (otherBox) {
    return this.topLeftColl(otherBox) || this.topRightColl(otherBox);
  };

  CollBox.prototype.isCollidedOnBottom = function (otherBox) {
    return this.bottomLeftColl(otherBox) || this.bottomRightColl(otherBox);
  };

  CollBox.prototype.isCollidedOnLeft = function (otherBox) {
    return this.bottomLeftColl(otherBox) || this.topLeftColl(otherBox);
  }

  CollBox.prototype.isCollidedOnRight = function (otherBox) {
    return this.bottomRightColl(otherBox) || this.topRightColl(otherBox);
  };

})();
