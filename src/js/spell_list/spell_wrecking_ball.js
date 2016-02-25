'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var WreckingBallSpell = Spell.extend({
  img: require('graphics/spell_wrecking_ball2.png'),
  dim: [12, 12],
  duration: 90,
  sType: 'melee',
  sId: 'wreckingBall',
  initialize: function () {
    this.sprite.sizeX = 100;
    this.sprite.sizeY = 100;
    this.game.playSE('swing.ogg');
  },

  tickEvent: function () {
    var action = this.caster.actions.spells[this.spellIndex];
    if (!this.caster.isDead() && (action === 'hold' || action === 'tap')) {
      if (this.isFired) {
        this.sType = 'melee';
        this.isFired = false;
      }

      this.duration = 90;
      ParticleSplatter(4, connection.bind(this));
      this.vel.plus(this.caster.pos.dup().minus(this.pos).divided(130)).times(0.97);
      if (this.vel.toScalar() > 18) {
        this.vel.times(18 / this.vel.toScalar());
      }
    } else {
      if (!this.isFired) {
        this.isFired = true;
        this.sType = 'projectile';
      }
    }
  },

  wizardColl: function (wizard) {
    if (wizard !== this.caster && this.vel.toScalar() > 4) {
      this.game.playSE('hard_hit.ogg', 0.8);
      wizard.kill(this.caster);
    }
  },

  removeEvent: function () {
    this.caster.cooldownList[this.spellIndex] = 120;
  },

  spellColl: null,
  solidColl: null,
});

SpellList.WreckingBall = function (spellIndex) {
  // Only One Wrecking Ball per player at a time.
  for (var i = this.game.spells.length - 1; i >= 0; i--) {
    var currSpell = this.game.spells[i];
    if (currSpell.sId === 'wreckingBall' && currSpell.caster === this) {
      return;
    }
  }

  var spell = new WreckingBallSpell({
    pos: this.pos,
    vel: new Coord(0),
    game: this.game,
    caster: this,
    spellIndex: spellIndex,
  });
  this.game.spells.push(spell);
  this.globalCooldown = 30;
  return spell;
};

var connection = function () {
  var randPos = this.caster.pos.randomBetweenLine(this.pos);
  return {
    pos: randPos,
    vel: [0, 0],
    game: this.game,
    duration: 10,
    radius: Math.random() * 2 + 1,
    color: 'floralwhite',
  };
};

export default SpellList.WreckingBall;
