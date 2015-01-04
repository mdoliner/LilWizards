(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.UziBullet = function (spellIndex) {
    var spell = new LW.Spell({
      pos: this.pos,
      vel: this.spellDirection().times(8),
      img: "graphics/spell_bullet.gif",
      dim: [3,3],
      game: this.game,
      caster: this,
      duration: 15,
      sType: "projectile",
      sId: "uziBullet",
      initialize: function () {
        this.game.playSE('bullet.ogg');
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
    });
    this.game.spells.push(spell);
    this.vel.minus(this.spellDirection().times(2));
    this.globalCooldown = 3;

    return spell;
  };

  LW.SpellList.Uzi = function (spellIndex) {
    var spell = new LW.Spell({
      pos: this.pos,
      vel: this.spellDirection().times(8),
      img: "graphics/spell_bullet.gif",
      dim: [0,0],
      game: this.game,
      caster: this,
      duration: 14,
      sType: "ray",
      sId: "uzi",
      tickEvent: function () {
        if (this.isFired) {
          return;
        } else if (this.caster.actions["spells"][spellIndex] === "hold") {
            this.pos.x = this.caster.pos.x;
            this.pos.y = this.caster.pos.y;
            this.childGen = this.childGen + 1 || 1;
            if (this.childGen % 6 === 0) {
              var newSpell = LW.SpellList.UziBullet.bind(this.caster)(spellIndex);
            }
            // Make new uzi right before timeout.
            if (this.childGen === 13) {
              var newSpell = LW.SpellList.Uzi.bind(this.caster)(spellIndex)
            }
          }
        },
      wizardColl: function (wizard) {
      },
    });
    this.game.spells.push(spell);
    this.globalCooldown = 2;
    this.cooldownList[spellIndex] = 5;
    return spell;
  };

})();
