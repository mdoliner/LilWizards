(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Lollipop = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(30).plusAngleDeg(90),
      img: "graphics/spell_sword.png",
      dim: [25,4],
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
        this.wizardBuffer -= 1;
        if (this.hasWizard) {
          this.collBox.dim.times(0);
          this.victim.pos.setTo(this.pos);
          this.vel.setTo(this.caster.spellDirection().times(30));
        } else {
          this.vel.plusAngleDeg(-9);
          this.collBox.angle = this.vel.toAngleDeg();
        }

        this.pos.setTo(this.caster.pos)
      },
      spellColl: function (spell) {
        if (spell.caster === this.caster) {return;};
        if (spell.sType === "projectile" || spell.sType === "static") {
          this.caster.addAilment(new LW.Ailment({
            duration: 360,
            victim: this.caster,
            wizard: this.caster,
            initialize: function () {
              var id = spell.sId.charAt(0).toUpperCase() + spell.sId.slice(1);
              this.victim.spellList[spellIndex] = LW.SpellList[id];
            },
            removeEvent: function () {
              this.victim.spellList[spellIndex] = LW.SpellList.Lollipop;
            }
          }));
        }
        this.caster.cooldownList[spellIndex] = 0;
        this.remove();
        spell.remove();
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster && !this.hasWizard) {
          this.victim = wizard;
          this.duration = 360;
          this.dim = [0,0];
          this.hasWizard = true;
          this.caster.cooldownList[spellIndex] = 360;
          this.victim.globalCooldown = 360;
        }
      },
      solidColl: null
    });

    this.game.spells.push(spell);
    this.globalCooldown = 10;
    this.cooldownList[spellIndex] = 30;
    return spell;
  }

})();
