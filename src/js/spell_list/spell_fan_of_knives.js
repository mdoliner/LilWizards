'use strict';
import ParticleSplatter from '../utilities/particle_splatter';
import Ailment from '../base/ailment';
import Spell from '../base/spell';
import SpellList from '../base/spell_list';
import Coord from '../utilities/coord';

var FanOfKnivesSpell = Spell.extend({
  img: require('graphics/spell_sun_shuriken.png'),
  dim: [2, 2],
  duration: -1,
  sType: 'melee',
  sId: 'fanOfKnives',
  tickEvent: function () {
    this.sprite.baseAngle -= 2;
    if (this.isFired) {
      return;
    }

    if (this.caster.actions.spells[this.spellIndex] === 'release' ||
      (this.caster.actions.spells[this.spellIndex] === 'none' && !this.isFired)) {
      this.vel.divided([3, 3]);
      this.collBox.dim.plus(3);
      this.isFired = true;
      this.sType = 'projectile';
      this.solidColl = function () {
        if (this.isFired) {
          this.remove();
        }
      };
    } else if (this.caster.actions.spells[this.spellIndex] === 'hold') {
      this.pos.x = this.caster.pos.x;
      this.pos.y = this.caster.pos.y;
      if (this.isChild) {return;}

      this.childGen = this.childGen + 1 || 1;
      if (this.childGen <= 90 && this.childGen % 30 === 0) {
        var newSpell = SpellList.FanOfKnives.call(this.caster, this.spellIndex, true);
        newSpell.vel = this.vel.dup().plusAngleDeg(this.childGen);
      }
    }
  },

  spellColl: null,
  solidColl: null,
  removeEvent: function () {
    this.game.playSE('metal_ping.ogg');
    ParticleSplatter(5, fanOfKnivesParticles.bind(this));
  },
});

SpellList.FanOfKnives = function (spellIndex, isChild) {
  var spell = new FanOfKnivesSpell({
    pos: this.pos,
    vel: this.spellDirection().times([15, 15]).plusAngleDeg(-45),
    game: this.game,
    caster: this,
    spellIndex: spellIndex,
    isChild: isChild,
  });

  spell.sprite.sizeX = 60;
  spell.sprite.sizeY = 60;
  this.game.playSE('swing.ogg');
  this.game.spells.push(spell);
  this.globalCooldown = 30;
  this.cooldownList[spellIndex] = 60;
  return spell;
};

var fanOfKnivesParticles = function () {
  var randVel = this.vel.dup().times([-Math.random(), -Math.random()]).plusAngleDeg(Math.random() * 120 - 60);
  return {
    pos: this.pos,
    vel: randVel,
    game: this.game,
    duration: Math.floor(Math.random() * 20 + 10),
    radius: Math.random() * 2 + 1,
    color: 'grey',
  };
};

export default SpellList.FanOfKnives;