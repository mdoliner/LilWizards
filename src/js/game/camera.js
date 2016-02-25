'use strict';
import Coord from '../utilities/coord';
import Game from './game';

function Camera(options) {
  this.pos = new Coord(options.pos);
  this.size = options.size;
  this.hasMoved = true;
  this.move = {
    endPos: null,
    moveType: 'ease',
    duration: 120,
    time: -1,
  };
  this.shake = {
    time: -1,
    direction: '',
    modCoord: new Coord([0,0]),
    modSize: 0,
  };
}

Camera.prototype.relativePos = function (pos) {
  var newPos = pos.dup();
  newPos.x = (Game.DIMX / 2) - (this.size * (this.pos.x - pos.x) / 100);
  newPos.y = (Game.DIMY / 2) - (this.size * (this.pos.y - pos.y) / 100);
  return newPos;
};

Camera.prototype.step = function () {
  this.hardMove();
  this.shakeScreen();
};

Camera.prototype.hardMove = function () {
  if (this.move.time <= 0) return;

  this.hasMoved = true;
  var posVel;
  var sizeVel;
  if (this.move.moveType === 'ease') {
    var time = this.move.duration - this.move.time;
    var distanceX = (this.move.endPos.x - this.move.startPos.x);
    var duration = this.move.duration;
    var posVelX = (-6 * distanceX / Math.pow(duration, 3)) * time * (time - duration);
    var distanceY = (this.move.endPos.y - this.move.startPos.y);
    var posVelY = (-6 * distanceY / Math.pow(duration, 3)) * time * (time - duration);
    posVel = new Coord([posVelX, posVelY]);

    var deltaSize = (this.move.endSize - this.move.startSize);
    sizeVel = (-6 * deltaSize / Math.pow(duration, 3)) * time * (time - duration);
  } else if (this.move.moveType === 'linear') {
    posVel = this.move.endPos.dup().minus(this.move.startPos).divided([this.move.duration,this.move.duration]);
    sizeVel = (this.move.endSize - this.move.startSize) / this.move.duration;
  }

  this.move.time -= 1;
  this.size += sizeVel;
  this.pos.plus(posVel);
};

Camera.prototype.shakeScreen = function () {
  if (this.shake.time <= 0) {return;}

  this.hasMoved = true;
  this.shake.direction.split('').forEach(function (direction) {
    if (direction === 's') {
      this.size -= this.shake.modSize + this.shake.power;
      this.shake.modSize = -this.shake.power;
    } else {
      this.pos[direction] -= this.shake.modCoord[direction] + this.shake.power;
      this.shake.modCoord[direction] = -this.shake.power;
    }
  }.bind(this));
  this.shake.time -= 1;
  var shakeChange = Math.abs(this.shake.power) - this.shake.startPower / this.shake.duration;
  this.shake.power /= Math.abs(this.shake.power) + 0.01;
  this.shake.power *= -shakeChange;
};

Camera.prototype.moveTo = function (options) {
  this.move.startPos = this.pos.dup();
  this.move.startSize = this.size;
  this.move.endPos = new Coord(options.endPos) || this.move.endPos || this.pos;
  this.move.endSize = options.endSize || this.move.endSize || this.size;
  this.move.moveType = options.moveType || 'ease';
  this.move.duration = options.duration || 120;
  this.move.time = this.move.duration;
};

Camera.prototype.startShake = function (options) {
  if (this.shake.modCoord.toScalar() > 0 || this.shake.modeSize > 0) {
    this.pos.minus(this.shake.modCoord);
    this.size -= this.shake.modSize;
  }

  this.shake.modCoord = new Coord([0,0]);
  this.shake.modSize = 0;
  this.shake.power = options.power || 5;
  this.shake.startPower = this.shake.power;
  this.shake.direction = options.direction || 'x';
  this.shake.duration = options.duration || 20;
  this.shake.time = this.shake.duration;
};

export default Camera;
