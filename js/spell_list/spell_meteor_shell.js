(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.MeteorShield = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_meteor_shell.png",
      dim: [30,30],
      game: this.game,
      caster: this,
      duration: 360,
      sType: "melee",
      sId: "meteorShield",
      initialize: function () {
        this.sprite.sizeY = 66;
        this.sprite.sizeX = 66;
        this.game.playSE('rock_up.ogg');
        LW.ParticleSplatter(10, rockExplode.bind(this));
        this.caster.friction.x /= .95;
        this.caster.jumpModifier *= 0.01;
        this.caster.maxVelX *= 0.01;
        this.sprite.opacity = 0.5;
      },
      tickEvent: function () {
        this.caster.pos.plus([0,0.02]);
        this.pos.setTo(this.caster.pos);
        this.vel.setTo(0);
        this.sprite.baseAngle += 1;
        var action = this.caster.actions.spells[spellIndex];
        if (action === "release" || action === "none") {
          this.remove();
        }
        this.caster.globalCooldown = 20;
        this.caster.cooldownList[spellIndex] = 30;
      },
      spellColl: function (spell) {
        if (spell.caster === this.caster) {return};
        if (spell.sType === "melee") {
          var dir = spell.caster.pos.dup().minus(this.pos)
          if (dir.toScalar() === 0) {
            dir.plus(1)
          }
          dir = dir.toUnitVector()
          spell.caster.vel.plus(dir.dup().times(8));
          spell.vel.times(-1);
          this.game.playSE('metal_ping.ogg');
          spell.remove();
        } else {
          spell.remove();
        }
      },
      solidColl: null,
      wizardColl: function (wizard) {
        if (wizard !== this.caster && this.caster.vel.toScalar() > 5) {
          wizard.kill(this.caster);
        }
      },
      removeEvent: function () {
        this.caster.friction.x *= .95;
        this.caster.cooldownList[spellIndex] = 90;
        LW.ParticleSplatter(10, rockExplode.bind(this));
        this.caster.jumpModifier /= 0.01;
        this.caster.maxVelX /= 0.01;
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 20;
    this.cooldownList[spellIndex] = 30;
    return spell;
  };

  var rockExplode = function () {
    var randVel = (new LW.Coord([Math.random()*3,0])).plusAngleDeg(Math.random()*360)
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random()*5+25),
      radius: Math.random()*3+2,
      color: {
        hue: 200,
        sat: 50,
        light: 53,
        alpha: 1
      },
      tickEvent: function () {
        this.vel.y += 0.01
      }
    };
  };

})();
