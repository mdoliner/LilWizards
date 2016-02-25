'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var UpdraftSpell = Spell.extend({
  img: require('graphics/spell_updraft.png'),
  dim: [15, 15],
  duration: 30,
  imgBaseAngle: 270,
  sType: 'melee',
  sId: 'updraft',
  initialize: function () {
    this.sprite.sizeY = 52;
    this.sprite.sizeX = 52;
    this.game.playSE('ice.ogg');
    ParticleSplatter(10, iceyGather.bind(this));
    this.caster.vel.y = 0;
    this.caster.vel.x = 0;
  },

  tickEvent: function () {
    this.vel.plusUpAngleDeg(10);
    this.caster.vel.plus(this.vel.dup().divided(20));
    if (this.caster.vel.toScalar() > 14) {
      this.caster.vel.times(14 / this.caster.vel.toScalar());
    }

    this.pos.setTo(this.caster.pos);
    ParticleSplatter(1, iceyTrail.bind(this));
  },

  spellColl: null,
  solidColl: null,
  removeEvent: function () {
    this.caster.vel.y = -4;
    ParticleSplatter(20, iceyExplode.bind(this));
  },
});

SpellList.Updraft = function (spellIndex) {
  var spell = new UpdraftSpell({
    pos: this.pos,
    vel: this.horSpellDirection().times(15),
    game: this.game,
    caster: this,
  });

  this.game.spells.push(spell);
  this.globalCooldown = 20;
  this.cooldownList[spellIndex] = 90;
  return spell;
};

var iceyTrail = function () {
  var color = ['deepskyblue', 'royalblue', 'dodgerblue'][Math.floor(Math.random() * 3)];
  return {
    pos: this.pos,
    vel: [0, 0],
    game: this.game,
    duration: Math.floor(Math.random() * 5 + 5),
    radius: Math.random() * 5 + 1,
    color: color,
  };
};

var iceyGather = function () {
  var color = ['deepskyblue', 'royalblue', 'dodgerblue'][Math.floor(Math.random() * 3)];
  var offset = (new Coord([Math.random() * 30, 0])).plusAngleDeg(Math.random() * 360);
  return {
    pos: this.pos.dup().plus(offset),
    vel: offset.toUnitVector().times(-2),
    game: this.game,
    duration: Math.floor(Math.random() * 5 + 15),
    radius: Math.random() * 5 + 1,
    color: color,
  };
};

var iceyExplode = function () {
  var color = ['deepskyblue', 'royalblue', 'dodgerblue'][Math.floor(Math.random() * 3)];
  var offset = (new Coord([Math.random() * 4, 0])).plusAngleDeg(Math.random() * 360);
  return {
    pos: this.pos,
    vel: offset,
    game: this.game,
    duration: Math.floor(Math.random() * 15 + 15),
    radius: Math.random() * 3 + 3,
    color: color,
    tickEvent: function () {
      this.vel.y += 0.04;
    },
  };
};

export default SpellList.Updraft;
