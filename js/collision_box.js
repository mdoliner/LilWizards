(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CollBox = LW.CollBox = function (pos, dimension){
    this.dim = dimension;
    this.pos = pos;
  };

  CollBox.prototype.totalCollision = function (otherBox) {
    if (Math.abs(this.pos.x - otherBox.pos.x) < this.dim[0] + otherBox.dim[0] &&
        Math.abs(this.pos.y - otherBox.pos.y) < this.dim[1] + otherBox.dim[1]) {
      return otherBox;
    }
    return false;
  }

})();
