/**
 * Ailment class.
 */
'use strict';
import _ from 'lodash';
import Util from '../utilities/utils';

function Ailment(attr) {
  _.extend(this, attr);
  this.initialize && this.initialize();
  this.time = this.duration || 120;
  this.victim = attr.victim;
}

Ailment.extend = Util.fnExtend;

Ailment.prototype.tickEvent = function () {};

Ailment.prototype.removeEvent = function () {};

Ailment.prototype.step = function () {
  this.tickEvent && this.tickEvent();
  this.time -= 1;
  if (this.time === 0) {
    this.remove();
  }
};

Ailment.prototype.remove = function () {
  this.victim.remove(this);
  this.removeEvent && this.removeEvent();
};

export default Ailment;
