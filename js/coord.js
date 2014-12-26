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

  Coord.prototype.dup = function () {
    return new Coord([this.x, this.y]);
  }

  Coord.prototype.toCoord = function () {
    return this;
  };

  Array.prototype.toCoord = function () {
    return new Coord(this);
  };

})();
