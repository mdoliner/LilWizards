'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var DarkRiftSpell = Spell.extend({
  img: require('graphics/spell_dark_rift.png'),
  dim: [15, 15],
  duration: 199,
  sType: 'static',
  sId: 'darkRift',
  initialize: function () {
    this.game.playSE('dark_rift.ogg', 60);
    this.sprite.sizeX = 10;
    this.sprite.sizeY = 10;
  },

  tickEvent: function () {
    this.sprite.baseAngle += 3;
    this.sprite.sizeX = Math.min(this.sprite.sizeX + 1, 60);
    this.sprite.sizeY = Math.min(this.sprite.sizeY + 1, 60);
    this.vel.times(0.96);
    var tickAmount = 50;
    if (this.duration % tickAmount === 0) {
      this.wizardColl = function (wizard) {
        if (wizard !== this.caster) {
          wizard.kill(this.caster);
        }
      };

      ParticleSplatter(tickAmount, pulseParticles.bind(this));
      var pulse = this.pulse.bind(this);
      this.game.spells.filter(function (spell) {
        return spell.sType === 'projectile';
      }.bind(this)).forEach(pulse);
      this.game.wizards.filter(function (wizard) {
        return this.caster !== wizard;
      }.bind(this)).forEach(pulse);
    }
  },

  pulse: function (obj) {
    var dist = this.pos.dup().minus(obj.pos);
    var distance = dist.toScalar();
    if (distance > 200) { return; }

    distance = Math.max(distance, 60);
    obj.vel.plus(dist.divided(Math.pow(distance / 20, 1.6)));
  },

  spellColl: null,
  solidColl: null,
  wizardColl: null,
  removeEvent: function () {
    ParticleSplatter(30, endParticles.bind(this));
    this.game.playSE('sizzle.ogg');
  },
});

SpellList.DarkRift = function (spellIndex) {
  var spell = new DarkRiftSpell({
    pos: this.pos,
    vel: this.spellDirection().times(10),
    game: this.game,
    caster: this,
  });
  this.game.spells.push(spell);
  this.globalCooldown = 30;
  this.cooldownList[spellIndex] = 150;
  return spell;
};

var pulseParticles = function () {
  var offset = (new Coord([200, 0])).plusAngleDeg(Math.random() * 360);
  var myPos = this.pos;
  return {
    pos: this.pos.dup().plus(offset),
    vel: offset.dup().divided(-30).plusAngleDeg(45),
    game: this.game,
    duration: 20,
    radius: Math.random() * 2 + 2,
    color: 'white',
    tickEvent: function () {
      this.vel.setAngle(this.vel.dup().plus(myPos.dup().minus(this.pos).divided(400)).toAngle());
    },
  };
};

var endParticles = function () {
  var randVel = new Coord(Math.random() * 2).plusAngleDeg(Math.random() * 360);
  return {
    pos: this.pos,
    vel: randVel,
    game: this.game,
    duration: Math.random() * 20 + 20,
    radius: Math.random() * 2 + 2,
    color: 'white',
  };
};

export default SpellList.DarkRift;
