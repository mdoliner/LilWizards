(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.Fireball = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([6, 6]),
      img: "graphics/spell_fireball.gif",
      dim: [5,5],
      game: this.game,
      caster: this,
      sType: "projectile",
      sId: "fireball",
      initialize: function () {
        this.game.playSE('fire_charge.ogg');
        this.delayTime = 40
      },
      tickEvent: function () {
        if (this.isFired) {
          return;
        } else if (this.delayTime > 30) {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          LW.ParticleSplatter(2, function () {
            var offset = new LW.Coord([20,20]);
            offset.plusAngleDeg(Math.random()*360);
            var randPos = this.caster.pos.dup().plus(offset);
            var spell = this;
            return {
              pos: randPos,
              vel: offset.divided(-20),
              game: this.game,
              duration: 20,
              radius: Math.random()*5+1,
              color: 'orange'
            };            
          }.bind(this))
        }
        if (this.delayTime <= 0) {
          this.isFired = true;
        }
        this.delayTime -= 1;
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      removeEvent: function () {
        this.game.playSE('fire2.ogg');
        LW.ParticleSplatter(10, function () {
          var randVel = this.vel.dup().times([-Math.random(),-Math.random()]).plusAngleDeg(Math.random()*120-60)
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+10),
            radius: Math.random()*2+1,
            color: 'yellow'
          };
        }.bind(this))

        var startPos = this.pos.dup().minus(this.vel);
        var dir = this.vel.toUnitVector();
        LW.SpellList.FireballSplit.bind(this.caster)(spellIndex, dir.dup().plusAngleDeg(90), startPos);
        LW.SpellList.FireballSplit.bind(this.caster)(spellIndex, dir.dup().plusAngleDeg(-90), startPos);
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  };

  LW.SpellList.FireballSplit = function (spellIndex, dir, pos) {
    var spell = new LW.Spell ({
      pos: pos,
      vel: dir.times([3.5, 3.5]),
      img: "graphics/spell_fireball.gif",
      dim: [2.5,2.5],
      game: this.game,
      caster: this,
      sType: "projectile",
      sId: "fireballSplit",
      duration: 24,
      initialize: function () {
        this.sprite.sizeX = 50;
        this.sprite.sizeY = 50;
      },
      tickEvent: null,
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      removeEvent: function () {
        LW.ParticleSplatter(5, function () {
          var randVel = this.vel.dup().times([-Math.random(),-Math.random()]).plusAngleDeg(Math.random()*120-60)
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+10),
            radius: Math.random()*2+1,
            color: 'yellow'
          };
        }.bind(this))
      }
    });
    this.game.spells.push(spell);
    return spell;
  };

})();
