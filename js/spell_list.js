(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SpellList = LW.SpellList = {};

  SpellList.Fireball = function () {
    var fireball = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([10, 10]),
      img: "graphics/spell_fireball.gif",
      dim: [5,5],
      game: this.game,
      caster: this
    });
    this.game.spells.push(fireball);
  }


})();
