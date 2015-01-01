(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CollBox = LW.CollBox = function (pos, dimension){
    this.dim = new LW.Coord(dimension);
    this.pos = pos;
  };

  CollBox.prototype.collision = function (otherObj) {
    var otherBox = otherObj.collBox;
    if (Math.abs(this.pos.x - otherBox.pos.x) < this.dim.x + otherBox.dim.x &&
        Math.abs(this.pos.y - otherBox.pos.y) < this.dim.y + otherBox.dim.y) {
      return otherObj;
    }
    return false;
  }

})();
