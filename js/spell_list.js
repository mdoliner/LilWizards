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
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill();
        }
      }
    });
    this.game.spells.push(fireball);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 30;
    this.vel.minus(this.spellDirection().times([3,3]));
  }

  SpellList.Sword = function (spellIndex) {
    var sword = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([20,20]),
      img: "graphics/spell_sword.png",
      dim: [5,5],
      game: this.game,
      caster: this,
      duration: 20,
      tickEvent: function () {
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        this.vel.plusAngleDeg(3);
      },
      spellColl: function (spell) {
        spell.caster = this.caster;
        spell.vel.times([-1.1,-1.1]);
      },
      solidColl: function () {}
    });
    this.game.spells.push(sword);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    this.vel.plus(this.spellDirection().times([3,3]))
  }


})();
