(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.FanOfKnives = function(spellIndex, isChild) {
    var spell = new LW.Spell({
      pos: this.pos,
      vel: this.spellDirection().times([15,15]).plusAngleDeg(-45),
      img: 'graphics/spell_shuriken.gif',
      dim: [2,2],
      game: this.game,
      caster: this,
      duration: -1,
      sType: 'melee',
      sId: 'fanOfKnives',
      tickEvent: function() {
        this.sprite.baseAngle += 1;
        if (this.isFired) {
          return;
        }

        if (this.caster.actions.spells[spellIndex] === 'release' ||
                  (this.caster.actions.spells[spellIndex] === 'none' && !this.isFired)) {
          this.vel.divided([3,3]);
          this.collBox.dim.plus(3);
          this.isFired = true;
          this.sType = 'projectile';
          this.solidColl = function() {
            if (this.isFired) {
              this.remove();
            }
          };
        } else if (this.caster.actions.spells[spellIndex] === 'hold') {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          if (isChild) {return;}

          this.childGen = this.childGen + 1 || 1;
          if (this.childGen <= 90 && this.childGen % 30 === 0) {
            var newSpell = LW.SpellList.FanOfKnives.bind(this.caster)(spellIndex, true);
            newSpell.vel = this.vel.dup().plusAngleDeg(this.childGen);
          }
        }
      },

      spellColl: null,
      solidColl: null,
      removeEvent: function() {
        this.game.playSE('metal_ping.ogg');
        LW.ParticleSplatter(5, function() {
          var randVel = this.vel.dup().times([-Math.random(),-Math.random()]).plusAngleDeg(Math.random() * 120 - 60);
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random() * 20 + 10),
            radius: Math.random() * 2 + 1,
            color: 'grey',
          };
        }.bind(this));
      },
    });
    this.game.playSE('swing.ogg');
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  };

})();
