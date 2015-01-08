(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.ToxicDarts = function (spellIndex) {
    var dir = this.spellDirection();
    if (dir.x !== 0) {
      dir.plusUpAngleDeg(20);
      var angleChange = LW.Coord.prototype.plusUpAngleDeg.bind(dir, -10);
    } else {
      dir.plusRightAngleDeg(20);
      var angleChange = LW.Coord.prototype.plusRightAngleDeg.bind(dir, -10);
    }
    LW.SpellList.ToxicDartShot.bind(this)(spellIndex, dir.dup());
    var nextDart = function () {
      angleChange();
      LW.SpellList.ToxicDartShot.bind(this)(spellIndex, dir.dup());
    }.bind(this)
    setTimeout(nextDart, 1000/120*5);
    setTimeout(nextDart, 1000/120*10);
    setTimeout(nextDart, 1000/120*15);
    setTimeout(nextDart, 1000/120*20);

    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 45;
    return;
  };

  LW.SpellList.ToxicDartShot = function (spellIndex, dir) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: dir.times(5),
      img: "graphics/spell_dart.gif",
      dim: [6,2],
      game: this.game,
      caster: this,
      imgBaseAngle: 235,
      sType: "projectile",
      sId: "toxicDart",
      initialize: function () {
        this.sprite.sizeX = 50;
        this.sprite.sizeY = 50;
        this.game.playSE('swing2.ogg', 0.4);
      },
      tickEvent: function () {
        PurpleSit.bind(this)();
        this.collBox.angle = this.vel.toAngleDeg();
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          var isKill = false;
          wizard.ailments.forEach(function (ailment) {
            if (ailment.id === "toxicDartEffect") {isKill = true;}
          })
          if (isKill) {
            wizard.kill(this.caster);
          } else {
            wizard.addAilment(new LW.Ailment({
              duration: 180,
              victim: wizard,
              tickEvent: PurpleFall,
              id: "toxicDartEffect",
              initialize: function () {
                this.modAccelX = this.victim.accelXModifier * 0.40;
                this.victim.accelXModifier -= this.modAccelX;
                this.modJump = this.victim.jumpModifier * 0.10;
                this.victim.jumpModifier -= this.modJump;
              },
              removeEvent: function () {
                this.victim.jumpModifier += this.modJump;
                this.victim.accelXModifier += this.modAccelX;
              //   this.victim.kill(this.wizard);
              }
            }))
          }
        }
      },
      removeEvent: PurplePop
    });
    this.game.spells.push(spell);
    return spell;
  };

  var PurplePop = function () {
    LW.ParticleSplatter(5, function () {
      var randVel = new LW.Coord([1,0]).plusAngleDeg(Math.random()*360);
      return {
        pos: this.pos,
        vel: randVel,
        game: this.game,
        duration: Math.floor(Math.random()*20+10),
        radius: Math.random()*2+1,
        color: 'darkorchid'
      };
    }.bind(this))
  };

  var PurpleFall = function () {
    LW.ParticleSplatter(1, function () {
      var pos = this.pos || this.victim.pos
      return {
        pos: pos,
        vel: [Math.random()-0.5,0],
        game: this.game || this.victim.game,
        duration: Math.floor(Math.random()*5+5),
        radius: Math.random()*2+1,
        color: 'darkorchid',
        tickEvent: function () {
          this.vel.y += 0.12;
        }
      };
    }.bind(this))
  };

  var PurpleSit = function () {
    LW.ParticleSplatter(1, function () {
      var pos = this.pos || this.victim.pos
      return {
        pos: pos,
        vel: [0,0],
        game: this.game || this.victim.game,
        duration: Math.floor(Math.random()*5+2),
        radius: Math.random()*2+1,
        color: 'darkorchid'
      };
    }.bind(this))
  };

})();
