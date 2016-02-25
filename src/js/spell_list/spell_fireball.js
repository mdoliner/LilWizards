'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var FireballSpell = Spell.extend({
  img: require('graphics/spell_fireball2.png'),
  dim: [5, 5],
  sType: 'projectile',
  sId: 'fireball',
  initialize: function () {
    this.game.playSE('fire_charge.ogg');
    this.delayTime = 40;
  },

  tickEvent: function () {
    if (this.isFired) {
      return;
    } else if (this.delayTime > 30) {
      this.pos.x = this.caster.pos.x;
      this.pos.y = this.caster.pos.y;
      ParticleSplatter(2, FireballStartParticles.bind(this));
    }

    if (this.delayTime <= 0) {
      this.isFired = true;
    }

    this.delayTime -= 1;
  },

  wizardColl: function (wizard) {
    if (wizard !== this.caster) {
      this.remove();
      wizard.kill(this.caster);
    }
  },

  removeEvent: function () {
    this.game.playSE('fire2.ogg');
    ParticleSplatter(10, FireballEndParticles.bind(this));

    const startPos = this.pos.dup().minus(this.vel);
    const dir = this.vel.toUnitVector();
    const idx = this.spellIndex;
    SpellList.FireballSplit.call(this.caster, idx, dir.dup().plusAngleDeg(90), startPos);
    SpellList.FireballSplit.call(this.caster, idx, dir.dup().plusAngleDeg(-90), startPos);
  },
});

SpellList.Fireball = function (spellIndex) {
  var spell = new FireballSpell({
    pos: this.pos,
    vel: this.spellDirection().times([6, 6]),
    game: this.game,
    caster: this,
    spellIndex: this.spellIndex,
  });
  this.game.spells.push(spell);
  this.globalCooldown = 30;
  this.cooldownList[spellIndex] = 60;
  return spell;
};

var FireballStartParticles = function () {
  var offset = new Coord([20, 20]);
  offset.plusAngleDeg(Math.random() * 360);
  var randPos = this.caster.pos.dup().plus(offset);
  return {
    pos: randPos,
    vel: offset.divided(-20),
    game: this.game,
    duration: 20,
    radius: Math.random() * 5 + 1,
    color: 'orange',
  };
};

var FireballEndParticles = function () {
  var randVel = this.vel.dup()
    .times([-Math.random(), -Math.random()])
    .plusAngleDeg(Math.random() * 120 - 60);
  return {
    pos: this.pos,
    vel: randVel,
    game: this.game,
    duration: Math.floor(Math.random() * 20 + 10),
    radius: Math.random() * 2 + 1,
    color: 'yellow',
  };
};

var FireBallSplitSpell = Spell.extend({
  img: require('graphics/spell_fireball2.png'),
  dim: [2.5, 2.5],
  sType: 'projectile',
  sId: 'fireballSplit',
  duration: 24,
  initialize: function () {
    this.sprite.sizeX = 50;
    this.sprite.sizeY = 50;
  },

  tickEvent: null,
  wizardColl: function (wizard) {
    if (wizard !== this.caster) {
      this.remove();
      wizard.kill(this.caster);
    }
  },

  removeEvent: function () {
    ParticleSplatter(5, FireBallSplitParticle.bind(this));
  },
});

SpellList.FireballSplit = function (spellIndex, dir, pos) {
  var spell = new FireBallSplitSpell({
    pos: pos,
    vel: dir.times([3.5, 3.5]),
    game: this.game,
    caster: this,
  });
  this.game.spells.push(spell);
  return spell;
};

var FireBallSplitParticle = function () {
  var randVel = this.vel.dup()
    .times([-Math.random(), -Math.random()])
    .plusAngleDeg(Math.random() * 120 - 60);
  return {
    pos: this.pos,
    vel: randVel,
    game: this.game,
    duration: Math.floor(Math.random() * 20 + 10),
    radius: Math.random() * 2 + 1,
    color: 'yellow',
  };
};

export default SpellList.Fireball;
