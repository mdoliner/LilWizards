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
      vel: (new LW.Coord([0,-1])).times(64),
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
        if (this.caster.horFacing === "right") {
          this.angleChange = 3;
        } else {
          this.angleChange = -3;
        }
      },
      tickEvent: function () {
        var action = this.caster.actions.spells[spellIndex];
        if (action === "hold" || action === "tap") {
          if (this.isFired) {
            this.vel = this.pos.dup().minus(this.caster.pos);
            this.sType = "melee"
            this.isFired = false;
          }
          this.duration += 1;
          LW.ParticleSplatter(5, connection.bind(this));
          this.pos.setTo(this.caster.pos)
          this.vel.plusAngleDeg(this.angleChange); 
        } else {
          if (!this.isFired) {
            var angularSpd = this.pos.dup().minus(this.caster.pos).toScalar() * (Math.abs(this.angleChange) * Math.PI / 180);
            this.vel = this.vel.toUnitVector().plusAngleDeg(this.angleChange * 30).times(angularSpd);
            this.isFired = true;
            this.sType = "projectile"
          }
        }
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.game.playSE('hard_hit.ogg', 0.5);
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
