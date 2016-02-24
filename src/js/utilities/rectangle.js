(function() {

  var Rect = LW.Rectangle = function(bounds) {
    this.x = bounds.x;
    this.y = bounds.y;
    this.width = bounds.width;
    this.height = bounds.height;
    this.angle = bounds.angle;
    this.parent = bounds.parent;
  };

  Rect.prototype.getAxis = function() {
    return this._axis || (this._axis = [
      new LW.Coord([1, 0]).rotateDeg(this.angle),
      new LW.Coord([0, 1]).rotateDeg(this.angle),
    ]);
  };

  Rect.prototype.sharesAxisWith = function(rect) {
    return (this.angle - rect.angle) % 90 === 0;
  };

  Rect.prototype.getProjectionOntoAxis = function(axis) {
    var projectedCorners = _.map(this.getCorners(), function(corner) {
      return corner.dot(axis);
    });

    var max = projectedCorners[0];
    var min = projectedCorners[0];
    var i;
    for (i = 1; i < projectedCorners.length; i++) {
      if (projectedCorners[i] > max) max = projectedCorners[i];
      if (projectedCorners[i] < min) min = projectedCorners[i];
    }

    return {
      min: min,
      max: max,
    };
  };

  Rect.prototype.getMid = function() {
    return new LW.Coord([this.x + this.width / 2, this.y + this.height / 2]);
  };

  Rect.prototype.getCorners = function() {
    if (this._corners) return this._corners;
    var TL = new LW.Coord([this.x, this.y]);
    var TR = new LW.Coord([this.x + this.width, this.y]);
    var BR = new LW.Coord([this.x + this.width, this.y + this.height]);
    var BL = new LW.Coord([this.x, this.y + this.height]);

    if (this.angle !== 0) {
      var angle = this.angle;
      var midPoint = this.getMid();
      _.each([TL, TR, BR, BL], function(corner) {
        corner.rotateDegAroundPoint(angle, midPoint);
      });
    }

    return this._corners = {
      TL: TL,
      TR: TR,
      BR: BR,
      BL: BL,
    };
  };

  var COLL_EPS = 1e-6

  Rect.prototype.collision = function(rect) {
    var axis = this.getAxis();
    if (!this.sharesAxisWith(rect)) {
      axis = axis.concat(rect.getAxis());
    }

    var thisProj;
    var rectProj;
    for (var i = 0; i < axis.length; i++) {
      thisProj = this.getProjectionOntoAxis(axis[i]);
      rectProj = rect.getProjectionOntoAxis(axis[i]);
      if (thisProj.max - rectProj.min <= COLL_EPS || rectProj.max - thisProj.min <= COLL_EPS) return false;
    }

    return true;
  };

})();
