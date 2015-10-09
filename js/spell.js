(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var defaults = {
    //duration: -1,
    //imgBaseAngle: 0,
    //imgSizeX: 100,
    //imgSizeY: 100,
  };

  var Spell = LW.Spell = function(options) {
    //_.defaults(options, defaults);
    Util.extend(this, options);

    this.pos = new LW.Coord(this.pos);
    this.vel = new LW.Coord(this.vel);
    this.collBox = new LW.CollBox(this, this.dim);
    this.sprite = new LW.Sprite({
      parent: this,
      img: this.img,
      baseAngle: this.imgBaseAngle,
      sizeX: this.imgSizeX,
      sizeY: this.imgSizeY,
    });

    this.try(this.initialize);
  };

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
  Spell.prototype.wizardColl = function(wizard) {
    if (wizard !== this.caster) {
      wizard.kill(this.caster);
      this.game.playSE('hit.ogg', 90);
    }
  };

  Spell.prototype.spellColl = null;
  Spell.prototype.solidColl = function() {
    this.remove();
  };

  Spell.prototype.removeEvent = null;


  Spell.prototype.getRect = function() {
    return this.collBox.getRect();
  };


  Spell.prototype.draw = function(ctx, camera) {
    this.sprite.angle = this.vel.toAngleDeg();
    this.sprite.draw(ctx, camera);
  };

  Spell.prototype.move = function() {
    this.tickEvent && this.tickEvent();
    this.pos.plus(this.vel);
    var collisions;

    if (this.wizardColl) {
      collisions = this.game.wizardCollisions(this.collBox);
      if (collisions) {
        collisions.forEach(function(wizard) {
          this.wizardColl(wizard);
        }.bind(this));
      }
    }

    if (this.spellColl) {
      collisions = this.game.spellCollisions(this.collBox);
      if (collisions) {
        collisions.forEach(function(spell) {
          this.spellColl(spell);
        }.bind(this));
      }
    }

    if (this.solidColl) {
      collisions = this.game.solidCollisions(this.collBox);
      if (collisions) {
        collisions.forEach(function(wall) {
          this.solidColl(wall);
        }.bind(this));
      }
    }

    this.duration -= 1;
    if (this.duration === 0) {
      this.remove();
    }
  };

  Spell.prototype.remove = function() {
    this.removeEvent && this.removeEvent();
    this.game.remove(this);
  };

})();
