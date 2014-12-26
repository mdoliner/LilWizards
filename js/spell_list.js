(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SpellList = LW.SpellList = {};

  SpellList.Fireball = function (spellIndex) {
    var fireball = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([6, 6]),
      img: "graphics/spell_fireball.gif",
      dim: [5,5],
      game: this.game,
      caster: this,
      tickEvent: function () {
        this.vel.plusAngleDeg(60);
      }
    });
    this.game.spells.push(fireball);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 30;
  }


})();
