/**
 * Ailment class.
 */
'use strict';
const _ = require('lodash');
const Util = require('../utilities/utils');

function Ailment(attr) {
  _.extend(this, attr);
  this.initialize && this.initialize();
  this.time = this.duration || 120;
  this.victim = attr.victim;
}

Ailment.extend = Util.fnExtend;

Ailment.prototype.tickEvent = function() {};

Ailment.prototype.removeEvent = function() {};

Ailment.prototype.step = function() {
  this.tickEvent && this.tickEvent();
  this.time -= 1;
  if (this.time === 0) {
    this.remove();
  }
};

Ailment.prototype.remove = function() {
  this.victim.remove(this);
  this.removeEvent && this.removeEvent();
};

module.exports = Ailment;
