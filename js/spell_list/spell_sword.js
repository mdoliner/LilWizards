(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Sword = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(30).plusAngleDeg(60),
      img: "graphics/spell_sword.png",
      dim: [17,6],
      game: this.game,
      caster: this,
      duration: 20,
      imgBaseAngle: 225,
      sType: "melee",
      sId: "sword",
      initialize: function () {
         this.caster.applyMomentum(this.caster.spellDirection().times(4))
         this.game.playSE('sword.ogg');
      },
      tickEvent: function () {
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        this.vel.plusAngleDeg(-6);
        // this.collBox.dim.setTo(this.vel).max(5);
        this.collBox.angle = this.vel.toAngleDeg();
      },
      spellColl: function (spell) {
        if (spell.caster === this.caster) {return;};
        if (spell.sType === "projectile") {
          spell.caster = this.caster;
          spell.vel.times([-1.1,-1.1]);
        }
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          wizard.kill(this.caster);
        }
      },
      solidColl: null
    });

    this.game.spells.push(spell);
    this.globalCooldown = 15;
    this.cooldownList[spellIndex] = 36;
    return spell;
  }

})();
