(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Spell = LW.Spell = function (options) {
    var defaults = {
      tickEvent: function () {},
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          wizard.kill(this.caster);
          this.game.playSE('hit.ogg', 90);
        }
      },
      spellColl: function () {},
      solidColl: function (wall) {
        this.remove();
      },
      removeEvent: function () {},
      duration: -1,
      imgBaseAngle: 0,
      imgSizeX: 100,
      imgSizeY: 100,
    }
    Util.extend(this, defaults, options);

    this.pos = new LW.Coord(this.pos);
    this.vel = new LW.Coord(this.vel);
    this.collBox = new LW.CollBox(this, this.dim);
    this.sprite = new LW.Sprite({
      parent: this,
      img: this.img,
      baseAngle: this.imgBaseAngle,
      sizeX: this.imgSizeX,
      sizeY: this.imgSizeY
    });

    this.try(this.initialize);
  };

  Spell.TOTAL_SPELL_NAMES = [
    "Crash",
    "Updraft",
    "Wave",
    "WreckingBall",
    "FanOfKnives",
    "Teleport",
    "Sword",
    "ToxicDarts",
    "Fireball",
    "EvilCandy",
    "RayCannon",
    "ForcePush",
    "Vomit",
    "DarkRift",
    "Berserk"
  ];

  Spell.prototype.draw = function (ctx, camera) {
    this.sprite.angle = this.vel.toAngleDeg();
    this.sprite.draw(ctx, camera);
  };

  Spell.prototype.move = function () {
    this.tickEvent && this.tickEvent();
    this.pos.plus(this.vel);

    if (this.wizardColl) {
      var collisions = this.game.wizardCollisions(this.collBox);
      if (collisions) {
        collisions.forEach(function (wizard) {
          this.wizardColl(wizard);
        }.bind(this));
      }
    }
    if (this.spellColl) {
      var collisions = this.game.spellCollisions(this.collBox);
      if (collisions) {
        collisions.forEach(function (spell) {
          this.spellColl(spell);
        }.bind(this));
      }
    }
    if (this.solidColl) {
      var collisions = this.game.solidCollisions(this.collBox);
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

})();
