(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.WreckingBall = function (spellIndex) {
    // Only One Wrecking Ball per player at a time.
    for (var i = this.game.spells.length - 1; i >= 0; i--) {
      var spell = this.game.spells[i]
      if (spell.sId === "wreckingBall" && spell.caster === this) {
        return;
      }
    };

    var spell = new LW.Spell ({
      pos: this.pos,
      vel: new LW.Coord(0),
      img: "graphics/spell_wrecking_ball.png",
      dim: [12,12],
      game: this.game,
      caster: this,
      duration: 90,
      sType: "melee",
      sId: "wreckingBall",
      initialize: function () {
        this.sprite.sizeX = 50;
        this.sprite.sizeY = 50;
        this.game.playSE('swing.ogg');
      },
      tickEvent: function () {
        var action = this.caster.actions.spells[spellIndex];
        if (!this.caster.isDead() && (action === "hold" || action === "tap")) {
          if (this.isFired) {
            this.sType = "melee"
            this.isFired = false;
          }
          this.duration = 90;
          LW.ParticleSplatter(4, connection.bind(this));
          this.vel.plus(this.caster.pos.dup().minus(this.pos).divided(130)).times(0.97);
          if (this.vel.toScalar() > 18) {
            this.vel.times(18/this.vel.toScalar());
          }
        } else {
          if (!this.isFired) {
            this.isFired = true;
            this.sType = "projectile"
          }
        }
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster && this.vel.toScalar() > 4) {
          this.game.playSE('hard_hit.ogg', 0.8);
          wizard.kill(this.caster);
        }
      },
      removeEvent: function () {
        this.caster.cooldownList[spellIndex] = 120;
      },
      spellColl: null,
      solidColl: null
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    return spell;
  };

  var connection = function () {
    var randPos = this.caster.pos.randomBetweenLine(this.pos);
    return {
      pos: randPos,
      vel: [0,0],
      game: this.game,
      duration: 10,
      radius: Math.random()*2+1,
      color: 'floralwhite'
    };
  }

})();
