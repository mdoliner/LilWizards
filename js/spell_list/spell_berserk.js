(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Berserk = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/empty.gif",
      dim: [0,0],
      game: this.game,
      caster: this,
      sType: "misc",
      sId: "berserk",
      initialize: function () {
        this.game.playSE('teleport.ogg');
        this.steroidTime = 600;
        this.pos = this.caster.pos;
        this.colors = ['white', 'gold', 'orange', 'papayawhip', 'orangered'];
        this.caster.maxVelX = 7;
        this.caster.nGravity = 0.14;
        this.caster.jGravity = 0.05;
      },
      tickEvent: function () {
        if (this.caster.isDead()) {
          this.remove();
        } else if (this.steroidTime === 0) {
          this.remove();
        } else {
          this.caster.globalCooldown -= 1;
          for (i in this.caster.cooldownList) {
            this.caster.cooldownList[i] -= 1;
          }
          LW.ParticleSplatter(Math.floor(20 - this.steroidTime/30), function () {
            var randVel = (new LW.Coord([1,1])).times(Math.random()).plusAngleDeg(Math.random()*360);
            return {
              pos: this.pos.dup().plus(Math.floor(5 - this.steroidTime/120) * .1),
              vel: randVel,
              game: this.game,
              duration: Math.floor(Math.random()*10+5),
              radius: Math.random()*2+1,
              color: this.colors[Math.floor(Math.random() * this.colors.length)]
            };
          }.bind(this))

          this.steroidTime -= 1;
        }
      },
      wizardColl: null,
      spellColl: null,
      solidColl: null,
      removeEvent: function () {
        this.caster.maxVelX = 5;
        this.caster.nGravity = 0.18;
        this.caster.jGravity = 0.07;
        this.caster.globalCooldown = 360;
      }
    });

    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 180;
    return spell;
  }

})();
