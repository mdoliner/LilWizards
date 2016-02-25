/**
 * Created by Justin on 2016-02-24.
 */
'use strict';
import Particle from '../base/particle';

export default function ParticleSplatter(amount, genFunc) {
  for (var i = 0; i < amount; i++) {
    var options = genFunc();
    options.game.particles.push(new Particle(options));
  }
}
