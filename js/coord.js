(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Coord = LW.Coord = function (pos) {
    if (pos instanceof LW.Coord) {
      pos = [pos.x, pos.y];
    }
    this.x = pos[0];
    this.y = pos[1];
  };

  Coord.prototype.plus = function (pos) {
    var newCoord = pos.toCoord();
    this.x += newCoord.x;
    this.y += newCoord.y;
    return this;
  };

  Coord.prototype.times = function (pos) {
    var newCoord = pos.toCoord();
    this.x *= newCoord.x;
    this.y *= newCoord.y;
    return this;
  };

  Coord.prototype.minus = function (pos) {
    var newCoord = pos.toCoord();
    this.x -= newCoord.x;
    this.y -= newCoord.y;
    return this;
  };

  Coord.prototype.divided = function (pos) {
    var newCoord = pos.toCoord();
    this.x /= newCoord.x;
    this.y /= newCoord.y;
    return this;
  };

  Coord.prototype.setTo = function (pos) {
    var newCoord = pos.toCoord();
    this.x = newCoord.x;
    this.y = newCoord.y;
    return this;
  }

  Coord.prototype.max = function (pos) {
    var newCoord = pos.toCoord();
    this.x = Math.max(this.x, newCoord.x);
    this.y = Math.max(this.y, newCoord.y);
    return this;
  };

  Coord.prototype.min = function (pos) {
    var newCoord = pos.toCoord();
    this.x = Math.min(this.x, newCoord.x);
    this.y = Math.min(this.y, newCoord.y);
    return this;
  };

  Coord.prototype.abs = function () {
    var newCoord = this.dup();
    newCoord.x = Math.abs(newCoord.x);
    newCoord.y = Math.abs(newCoord.y);
    return newCoord;
  };

  Coord.prototype.makeAbs = function () {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  };

  Coord.prototype.toAngle = function () {
    return Math.atan2(this.y, this.x);
  };

  Coord.prototype.toAngleDeg = function () {
    return Math.atan2(this.y, this.x) * 180 / Math.PI;
  };

  Coord.prototype.toScalar = function () {
    var xSqr = this.x * this.x;
    var ySqr = this.y * this.y;
    return Math.sqrt(xSqr + ySqr);
  };

  Coord.prototype.toUnitVector = function () {
    return this.dup().divided(this.toScalar());
  }

  Coord.prototype.setAngle = function (newAngle) {
    var scalar = this.toScalar();
    this.x = scalar * Math.cos(newAngle);
    this.y = scalar * Math.sin(newAngle);
    return this;
  }

  Coord.prototype.plusAngle = function (angle) {
    var newAngle = this.toAngle() + angle;
    return this.setAngle(newAngle);
  };

  Coord.prototype.plusAngleDeg = function (angle) {
    var newAngle = this.toAngleDeg() + angle;
    return this.setAngle(newAngle * Math.PI / 180);
  };

  Coord.prototype.plusUpAngleDeg = function (angle) {
    if (this.x > 0) {
      angle *= -1;
    }
    return this.plusAngleDeg(angle);
  };

  Coord.prototype.dup = function () {
    return new Coord([this.x, this.y]);
  };

  Coord.prototype.toCoord = function () {
    return this;
  };

  Array.prototype.toCoord = function () {
    return new Coord(this);
  };

  Number.prototype.toCoord = function () {
    return new Coord([this, this]);
  };

})();
