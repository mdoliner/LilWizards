(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Vomit = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(1),
      img: "graphics/spell_vomit.png",
      dim: [4,4],
      game: this.game,
      caster: this,
      duration: 90,
      sType: "ray",
      sId: "vomit",
      tickEvent: function () {
        if (this.duration < 30) {
          this.sprite.opacity -= 0.033;
        }
        this.sprite.sizeX += 1.45;
        this.sprite.sizeY += 1.15;
        this.collBox.dim.plus(1);
      },
      initialize: function () {
        this.game.playSE('vomit.ogg');
        this.inflicted = [];
        this.sprite.sizeX = 5.8;
        this.sprite.sizeY = 4.6;
        spraySparks.bind(this)();
      },
      spellColl: null,
      solidColl: null,
      wizardColl: function (wizard) {
        if (wizard !== this.caster && this.inflicted.indexOf(wizard) < 0) {
          wizard.addAilment(new LW.Ailment({
            duration: 480,
            victim: wizard,
            wizard: this.caster,
            tickEvent: greenSparks,
            initialize: function () {
              this.modAccelX = this.victim.accelXModifier * 0.75;
              this.victim.accelXModifier -= this.modAccelX;
              this.modJump = this.victim.jumpModifier * 0.75;
              this.victim.jumpModifier -= this.modJump;
              this.modMaxVelX = this.victim.maxVelX * 0.75;
              this.victim.maxVelX -= this.modMaxVelX;
            },
            removeEvent: function () {
              this.victim.jumpModifier += this.modJump;
              this.victim.accelXModifier += this.modAccelX;
              this.victim.maxVelX += this.modMaxVelX;
            //   this.victim.kill(this.wizard);
            }
          }));
          this.inflicted.push(wizard)
        }
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 120;
    return spell;
  };



  var greenSparks = function () {
    LW.ParticleSplatter(2, function () {
      var randVel = new LW.Coord([Math.random() * 2 + 0.5,0])
      randVel.plusAngleDeg(Math.random()*360)
      return {
        pos: this.victim.pos,
        vel: randVel,
        game: this.victim.game,
        duration: 20,
        radius: Math.random()*3+1,
        color: 'lawngreen'
      };            
    }.bind(this))
  };

  var spraySparks = function () {
    LW.ParticleSplatter(30, function () {
      var randVel = this.caster.spellDirection().times(Math.random()*1+1)
      if (randVel.x === 0) {
        if (randVel.y < 0) {randVel.times(1.5);}
        randVel.plusAngleDeg(Math.random()*80 - 40)
      } else {
        randVel.plusUpAngleDeg(Math.random()*50+30);
      }
      return {
        pos: this.caster.pos,
        vel: randVel,
        game: this.game,
        duration: 60,
        radius: Math.random()*5+1,
        color: 'lawngreen',
        tickEvent: function () {
          this.vel.y += 0.04;
        }
      };            
    }.bind(this))
  };

})();
