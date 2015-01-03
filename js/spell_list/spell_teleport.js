(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Teleport = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(10),
      img: "graphics/spell_teleport.png",
      dim: [5,5],
      game: this.game,
      caster: this,
      sType: "misc",
      sId: "teleport",
      initialize: function () {
         this.game.playSE('teleport.ogg');
      },
      tickEvent: function () {
        var action = this.caster.actions["spells"][spellIndex];
        if (action === "release" || action === "none") {
          this.pos.min([LW.Game.DIMX, LW.Game.DIMY]);
          this.pos.max(0);
          var collisions = this.game.solidCollisions(this.collBox);
          if (collisions) {
            this.game.playSE('fail.ogg');
            this.remove();
            return;
          }

          var collisions = this.game.wizardCollisions(this.collBox);
          if (collisions) {
            collisions.forEach(function (wizard) {
              if (wizard !== this.caster) {
                wizard.kill(this.caster);
              }
            }.bind(this));
          }
          this.caster.pos.setTo(this.pos);
          this.game.playSE('light.ogg');
          this.remove();
        }
      },
      wizardColl: null,
      spellColl: null,
      solidColl: null,
      removeEvent: function () {
        LW.ParticleSplatter(10, function () {
          var randVel = this.vel.dup().times(Math.random()).plusAngleDeg(Math.random()*360)
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*10+5),
            radius: Math.random()*2+1,
            color: 'white'
          };
        }.bind(this))
      }
    });

    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 180;
    return spell;
  }

})();
