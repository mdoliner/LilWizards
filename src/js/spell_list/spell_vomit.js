'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var VomitSpell = Spell.extend({
  img: require('graphics/spell_vomit.png'),
  dim: [4, 4],
  duration: 120,
  sType: 'ray',
  sId: 'vomit',
  tickEvent: function () {
    if (this.duration < 30) {
      this.sprite.opacity -= 0.033;
    }

    this.sprite.sizeX += 1.30;
    this.sprite.sizeY += 1.10;
    this.collBox.dim.plus(0.66);
  },

  initialize: function () {
    this.game.playSE('vomit.ogg');
    this.inflicted = [];
    this.sprite.sizeX = 5.8;
    this.sprite.sizeY = 4.6;
    spraySparks.bind(this)();
  },

  spellColl: null,
  solidColl: null,
  wizardColl: function (wizard) {
    if (wizard !== this.caster && this.inflicted.indexOf(wizard) < 0) {
      wizard.addAilment(new VomitAilment({
        victim: wizard,
        wizard: this.caster,
      }));
      this.inflicted.push(wizard);
    }
  },
});

SpellList.Vomit = function (spellIndex) {
  var spell = new VomitSpell({
    pos: this.pos,
    vel: this.spellDirection().times(1),
    game: this.game,
    caster: this,
  });
  this.game.spells.push(spell);
  this.globalCooldown = 20;
  this.cooldownList[spellIndex] = 120;
  return spell;
};

var VomitAilment = Ailment.extend({
  duration: 480,
  tickEvent: function () {
    greenSparks.call(this);
  },

  initialize: function () {
    this.modAccelX = 0.25;
    this.victim.accelXModifier *= this.modAccelX;
    this.modJump = 0.25;
    this.victim.jumpModifier *= this.modJump;
    this.modMaxVelX = 0.25;
    this.victim.maxVelX *= this.modMaxVelX;
  },

  removeEvent: function () {
    this.victim.jumpModifier /= this.modJump;
    this.victim.accelXModifier /= this.modAccelX;
    this.victim.maxVelX /= this.modMaxVelX;
  },
});

var greenSparks = function () {
  ParticleSplatter(2, function () {
    var randVel = new Coord([Math.random() * 2 + 0.5, 0]);
    randVel.plusAngleDeg(Math.random() * 360);
    return {
      pos: this.victim.pos,
      vel: randVel,
      game: this.victim.game,
      duration: 20,
      radius: Math.random() * 3 + 1,
      color: 'lawngreen',
    };
  }.bind(this));
};

var spraySparks = function () {
  ParticleSplatter(30, function () {
    var randVel = this.caster.spellDirection().times(Math.random() + 1);
    if (randVel.x === 0) {
      if (randVel.y < 0) {randVel.times(1.5);}

      randVel.plusAngleDeg(Math.random() * 80 - 40);
    } else {
      randVel.plusUpAngleDeg(Math.random() * 50 + 30);
    }

    return {
      pos: this.caster.pos,
      vel: randVel,
      game: this.game,
      duration: 60,
      radius: Math.random() * 5 + 1,
      color: 'lawngreen',
      tickEvent: function () {
        this.vel.y += 0.04;
      },
    };
  }.bind(this));
};

export default SpellList.Vomit;
