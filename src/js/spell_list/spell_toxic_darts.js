(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.ToxicDarts = function(spellIndex) {
    var dir = this.spellDirection();
    var angleChange;
    if (dir.x !== 0) {
      dir.plusUpAngleDeg(20);
      angleChange = dir.plusUpAngleDeg.bind(dir, -10);
    } else {
      dir.plusRightAngleDeg(20);
      angleChange = dir.plusRightAngleDeg.bind(dir, -10);
    }

    var fireDart = ToxicDartShot.bind(this, spellIndex);

    fireDart(dir.dup());

    var nextDart = function() {
      angleChange();
      fireDart(dir.dup());
    }.bind(this);

    setTimeout(nextDart, 1000 / 120 * 5);
    setTimeout(nextDart, 1000 / 120 * 10);
    setTimeout(nextDart, 1000 / 120 * 15);
    setTimeout(nextDart, 1000 / 120 * 20);

    this.globalCooldown = 25;
    this.cooldownList[spellIndex] = 60;
  };

  var ToxicDartSpell = LW.Spell.extend({
    img: require('graphics/spell_dart2.png'),
    dim: [5,5],
    imgBaseAngle: 45,
    sType: 'projectile',
    sId: 'toxicDart',
    initialize: function() {
      this.sprite.sizeX = 50;
      this.sprite.sizeY = 50;
      this.game.playSE('swing2.ogg', 0.4);
    },

    tickEvent: function() {
      PurpleSit.call(this);
    },

    wizardColl: function(wizard) {
      if (wizard !== this.caster) {
        this.remove();
        this.game.playSE('flesh_hit.ogg', 0.5);
        var isKill = false;
        wizard.ailments.forEach(function(ailment) {
          if (ailment.id === 'toxicDartEffect') {isKill = true;}
        });

        if (isKill) {
          wizard.kill(this.caster);
        } else {
          wizard.addAilment(new ToxicDarkAilment({
            victim: wizard,
          }));
        }
      }
    },

    removeEvent: function() {
      PurplePop.call(this);
    },
  });

  var ToxicDarkAilment = LW.Ailment.extend({
    id: 'toxicDartEffect',
    duration: 240,
    tickEvent: function() {
      PurpleFall.call(this);
    },

    initialize: function() {
      this.modMaxVelX = 0.60;
      this.victim.maxVelX *= this.modMaxVelX;
      this.modJump = 0.60;
      this.victim.jumpModifier *= this.modJump;
    },

    removeEvent: function() {
      this.victim.jumpModifier /= this.modJump;
      this.victim.maxVelX /= this.modMaxVelX;
    },
  });

  var ToxicDartShot = function(spellIndex, dir) {
    var spell = new ToxicDartSpell({
      pos: this.pos,
      vel: dir.times(9),
      game: this.game,
      caster: this,
    });
    this.game.spells.push(spell);
    return spell;
  };

  var PurplePop = function() {
    LW.ParticleSplatter(5, function() {
      var randVel = new LW.Coord([1,0]).plusAngleDeg(Math.random() * 360);
      return {
        pos: this.pos,
        vel: randVel,
        game: this.game,
        duration: Math.floor(Math.random() * 20 + 10),
        radius: Math.random() * 2 + 1,
        color: 'purple',
      };
    }.bind(this));
  };

  var PurpleFall = function() {
    LW.ParticleSplatter(1, function() {
      var pos = this.pos || this.victim.pos;
      return {
        pos: pos,
        vel: [Math.random() - 0.5,0],
        game: this.game || this.victim.game,
        duration: Math.floor(Math.random() * 5 + 10),
        radius: Math.random() * 2 + 1,
        color: 'purple',
        tickEvent: function() {
          this.vel.y += 0.12;
        },
      };
    }.bind(this));
  };

  var PurpleSit = function() {
    LW.ParticleSplatter(1, function() {
      var pos = this.pos || this.victim.pos;
      return {
        pos: pos.dup().minus(this.vel),
        vel: [0,0],
        game: this.game || this.victim.game,
        duration: Math.floor(Math.random() * 5 + 10),
        radius: Math.random() * 2 + 1,
        color: 'purple',
      };
    }.bind(this));
  };

})();
