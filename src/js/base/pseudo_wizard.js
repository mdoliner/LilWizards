/**
 * Created by Justin on 2016-02-24.
 */
'use strict';

function PseudoWizard() {
  this.actions = { // none, tap, hold, release
    jump: 'none',
    spells: ['none', 'none', 'none'],
    left: 'none',
    right: 'none',
    up: 'none',
    down: 'none',
  };
}

PseudoWizard.prototype.accelX = function () {};

PseudoWizard.prototype.faceDir = function () {};

export default PseudoWizard;
