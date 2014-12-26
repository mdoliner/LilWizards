(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Spell = LW.Spell = function (options) {
    defaults = {
      tickEvent: function () {},
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          wizard.kill();
        }
      },
      spellColl: null,
      solidColl: function (wall) {
        this.remove();
      },
      removeEvent: function () {},
      duration: -1
    }
    for (var attrname in options) { defaults[attrname] = options[attrname]; }

    this.pos = new LW.Coord(defaults.pos);
    this.vel = new LW.Coord(defaults.vel);
    this.sprite = new LW.Sprite({
      parent: this,
      img: defaults.img
    });
    this.collBox = new LW.CollBox(this.pos, defaults.dim)
    this.tickEvent = defaults.tickEvent;
    this.wizardColl = defaults.wizardColl;
    this.solidColl = defaults.solidColl;
    this.spellColl = defaults.spellColl;
    this.removeEvent = defaults.removeEvent;
    this.duration = defaults.duration;
    this.game = defaults.game;
    this.caster = defaults.caster;
  };

  Spell.prototype.draw = function (ctx) {
    this.sprite.draw(ctx);
  };

  Spell.prototype.move = function () {
    this.tickEvent();
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
    this.removeEvent();
    this.game.remove(this);
  };

})();
