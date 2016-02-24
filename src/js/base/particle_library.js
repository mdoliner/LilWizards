/**
 * Created by Justin on 2016-02-24.
 */
'use strict';

function Library() {
  this.particles = new Array(Library.MAXPARTICLES);
  this.length = 0;
}

Library.MAXPARTICLES = 10000;

Library.prototype.push = function(particle) {
  this.particles[this.length] = particle;
  this.length++;
};

Library.prototype.spliceOne = function(index) {
  if (!this.length) return;

  while (index < this.length) {
    this.particles[index] = this.particles[index + 1];
    index++;
  }

  this.length--;
};

Library.prototype.indexOf = function(particle) {
  for (var i = 0; i < this.length; i++) {
    if (this.particles[i] === particle) return i;
  }

  return -1;
};

Library.prototype.move = function() {
  for (var i = 0; i < this.length; i++) {
    this.particles[i].move();
  }
};

Library.prototype.draw = function(ctx, camera) {
  for (var i = 0; i < this.length; i++) {
    this.particles[i].draw(ctx, camera);
  }
};

module.exports = Library;
