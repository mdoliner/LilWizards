(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.ForcePush = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(6.7),
      img: "graphics/spell_push.gif",
      dim: [8,8],
      game: this.game,
      caster: this,
      duration: 30,
      sType: "ray",
      sId: "forcePush",
      tickEvent: function () {
        this.sprite.sizeY += 1.79;
        this.collBox.dim.plus(this.vel.dup().plusAngleDeg(90).abs().times(0.22));
      },
      initialize: function () {
        this.game.playSE('wind.ogg');
        this.sprite.sizeX = 33;
        this.sprite.sizeY = 7.16;
      },
      spellColl: function (spell) {
        if (spell.sType === "projectile") {
          spell.vel.setAngle(this.vel.toAngle()).times(1.1);
          spell.caster = this.caster;
        }
        if (spell.sType === "static") {
          spell.vel.setTo(this.vel);
          if (!spell.hitByForcePush) {
            spell.hitByForcePush = true
            var oldFunc = spell.tickEvent.bind(spell);
            spell.tickEvent = function () {
              spell.vel.divided(1.2);
              oldFunc();
            }
          }
        }
      },
      solidColl: null,
      wizardColl: function (wizard) {
        if (wizard === this.caster) {return;}
        if ((wizard.onGround && this.vel.y > 0) || 
          (this.vel.x < 0 && wizard.collBox.removeCollision("x",-2)) || 
          (this.vel.x > 0 && wizard.collBox.removeCollision("x", 2)) ||
          (this.vel.y < 0 && wizard.collBox.removeCollision("y",-2))) {
          wizard.kill(this.caster);
        } else {
          wizard.vel.setTo(this.vel).times(2.7);//.setAngle(wizard.pos.dup().minus(this.pos).toAngle());
          var makeWizardWind = function () {
            LW.ParticleSplatter(2, function () {
              var randVel = new LW.Coord([Math.random()*2+2,0])
              randVel.setAngle(wizard.vel.toAngle()).times(-1).plusAngleDeg(Math.random()*60-30);
              return {
                pos: wizard.pos,
                vel: randVel,
                game: this.game,
                duration: Math.floor(Math.random()*20+10),
                radius: Math.random()*2+2,
                color: "orange"
              };
            }.bind(this));
            if (wizard.vel.toScalar() > 7) {setTimeout(makeWizardWind, 1000/120);}
          }.bind(this);
          makeWizardWind();
        }
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 180;
    return spell;
  };

})();
