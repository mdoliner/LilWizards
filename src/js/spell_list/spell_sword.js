'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var SwordSpell = Spell.extend({
  img: require('graphics/spell_sword2.png'),
  dim: [17, 6],
  duration: 20,
  imgBaseAngle: 225,
  sType: 'melee',
  sId: 'sword',
  initialize: function () {
    this.caster.applyMomentum(this.caster.spellDirection().times(4));
    this.game.playSE('sword.ogg');
  },

  tickEvent: function () {
    this.pos.x = this.caster.pos.x;
    this.pos.y = this.caster.pos.y;
    this.vel.plusAngleDeg(-6);

    // this.collBox.dim.setTo(this.vel).max(5);
    this.collBox.angle = this.vel.toAngleDeg();
  },

  spellColl: function (spell) {
    if (spell.caster === this.caster) return;

    if (spell.sType === 'projectile') {
      spell.caster = this.caster;
      spell.vel.times([-1.1, -1.1]);
    }
  },

  wizardColl: function (wizard) {
    if (wizard !== this.caster) {
      wizard.kill(this.caster);
    }
  },

  solidColl: null,
});

SpellList.Sword = function (spellIndex) {
  var spell = new SwordSpell({
    pos: this.pos,
    vel: this.spellDirection().times(30).plusAngleDeg(60),
    game: this.game,
    caster: this,
  });

  this.game.spells.push(spell);
  this.globalCooldown = 15;
  this.cooldownList[spellIndex] = 36;
  return spell;
};

export default SpellList.Sword;
