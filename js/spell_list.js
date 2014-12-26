(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SpellList = LW.SpellList = {};

  SpellList.fireball = function () {
    var fireball = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection() * 10,
      img: "spell_fireball.gif",
      dim: [5,5],
      collEvent: function(obj) {
        this.remove();
      }
    })
  }


})();
