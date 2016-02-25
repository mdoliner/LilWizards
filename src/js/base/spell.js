/**
 * Spell Main Class
 */
'use strict';
import Coord from '../utilities/coord';
import CollBox from '../utilities/collision_box';
import Util from '../utilities/utils';
import _ from 'lodash';
import Sprite from './sprite';

function Spell(options) {
  //_.defaults(options, defaults);
  _.extend(this, options);

  this.pos = new Coord(this.pos);
  this.vel = new Coord(this.vel);
  this.collBox = new CollBox(this, this.dim);
  this.sprite = new Sprite({
    parent: this,
    img: this.img,
    baseAngle: this.imgBaseAngle,
    sizeX: this.imgSizeX,
    sizeY: this.imgSizeY,
  });

  this.try(this.initialize);
}

Spell.extend = Util.fnExtend;

Spell.prototype.imgSizeX = 100;
Spell.prototype.imgSizeY = 100;
Spell.prototype.imgBaseAngle = 0;
Spell.prototype.duration = -1;

Spell.TOTAL_SPELL_NAMES = [
  'Crash',
  'Updraft',
  'Wave',
  'WreckingBall',
  'FanOfKnives',
  'Teleport',
  'Sword',
  'ToxicDarts',
  'Fireball',
  'EvilCandy',
  'RayCannon',
  'ForcePush',
  'Vomit',
  'DarkRift',
  'Berserk',
];

Spell.prototype.tickEvent = null;
Spell.prototype.wizardColl = function (wizard) {
  if (wizard !== this.caster) {
    wizard.kill(this.caster);
    this.game.playSE('hit.ogg', 90);
  }
};

Spell.prototype.spellColl = null;
Spell.prototype.solidColl = function () {
  this.remove();
};

Spell.prototype.removeEvent = null;

Spell.prototype.getRect = function () {
  return this.collBox.getRect();
};

Spell.prototype.draw = function (ctx, camera) {
  this.sprite.angle = this.vel.toAngleDeg();
  this.sprite.draw(ctx, camera);
};

Spell.prototype.move = function () {
  this.tickEvent && this.tickEvent();
  this.pos.plus(this.vel);
  var collisions;

  if (this.wizardColl) {
    collisions = this.game.wizardCollisions(this.collBox);
    if (collisions) {
      collisions.forEach(function (wizard) {
        this.wizardColl(wizard);
      }.bind(this));
    }
  }

  if (this.spellColl) {
    collisions = this.game.spellCollisions(this.collBox);
    if (collisions) {
      collisions.forEach(function (spell) {
        this.spellColl(spell);
      }.bind(this));
    }
  }

  if (this.solidColl) {
    collisions = this.game.solidCollisions(this.collBox);
    if (collisions) {
      collisions.forEach(function (wall) {
        this.solidColl(wall);
      }.bind(this));
    }
  }

  this.duration -= 1;
  if (this.duration === 0) {
    this.remove();
  }
};

Spell.prototype.remove = function () {
  this.removeEvent && this.removeEvent();
  this.game.remove(this);
};

export default Spell;
