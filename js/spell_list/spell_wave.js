(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Wave = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_wave.png",
      imgBaseAngle: 270,
      dim: [15,5],
      game: this.game,
      caster: this,
      duration: 60,
      sType: "melee",
      sId: "wave",
      initialize: function () {
        this.game.playSE('wave.ogg')
        this.sprite.sizeX = 7.27;
        this.sprite.sizeY = 7.27;
        if (this.caster.horFacing === "right") {
          this.vel.setTo([this.caster.maxVelX * 2,0]);
        } else {
          this.vel.setTo([this.caster.maxVelX * -2,0]);
        }
      },
      tickEvent: function () {
        var action = this.caster.actions["spells"][spellIndex]
        if (action === "release" || action === "none") {
          this.remove();
        } else {
          this.caster.vel.setTo(this.vel);
          this.pos.setTo(this.caster.pos).plus([0,15]).minus(this.vel);
          LW.ParticleSplatter(2, function () {
            var randVel = this.vel.toUnitVector().times(-Math.random()*3).plusUpAngleDeg(Math.random()*45);
            return {
              pos: this.pos,
              vel: randVel,
              game: this.game,
              duration: Math.floor(Math.random()*20+15),
              radius: Math.random()*5+1,
              color: "lightblue"
            };
          }.bind(this))
        }
      },
      spellColl: null,
      solidColl: null,
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 120;
    return spell;
  };

})();
