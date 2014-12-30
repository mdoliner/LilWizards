(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Camera = LW.Camera = function (options) {
  	this.pos = new LW.Coord(options.pos);
  	this.size = options.size;
  	this.move = {
  		endPos: null,
  		moveType: "ease",
  		duration: 120,
  		time: -1,
  	}
  };

  Camera.prototype.relativePos = function (pos) {
  	var newPos = pos.dup();
  	newPos.x = (LW.Game.DIMX / 2) - (this.size * (this.pos.x - pos.x) / 100);
  	newPos.y = (LW.Game.DIMY / 2) - (this.size * (this.pos.y - pos.y) / 100);
  	return newPos;
  };

  Camera.prototype.step = function () {
  	if (this.move.time <= 0) {return;}
  	var posVel, sizeVel;
  	if (this.move.moveType === "ease") {
  		var time = this.move.duration - this.move.time;
  		var distanceX = (this.move.endPos.x - this.move.startPos.x);
  		var duration = this.move.duration
  		var posVelX = (-6*distanceX/Math.pow(duration, 3)) * time * (time - duration);
	  	var distanceY = (this.move.endPos.y - this.move.startPos.y);
	  	var posVelY = (-6*distanceY/Math.pow(duration, 3)) * time * (time - duration);
	  	posVel = new LW.Coord([posVelX, posVelY]);

	  	var deltaSize = (this.move.endSize - this.move.startSize); 
	  	var sizeVel = (-6*deltaSize/Math.pow(duration, 3)) * time * (time - duration);
  	} else if (this.move.moveType === "linear") {
  		posVel = this.move.endPos.dup().minus(this.move.startPos).divided([this.move.duration,this.move.duration]);
  		sizeVel = (this.move.endSize - this.move.startSize) / this.move.duration;
  	}
  	this.move.time -= 1;
  	this.size += sizeVel;
  	this.pos.plus(posVel);
  };

  Camera.prototype.moveTo = function (options) {
  	this.move.startPos = this.pos.dup();
  	this.move.startSize = this.size;
  	this.move.endPos = new LW.Coord(options.endPos) || this.move.endPos || this.pos;
  	this.move.endSize = options.endSize || this.move.endSize || this.size;
  	this.move.moveType = options.moveType || "ease";
  	this.move.duration = options.duration || 120;
  	this.move.time = this.move.duration;
  };

})();
