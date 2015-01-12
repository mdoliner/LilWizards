(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.RayCannon = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_ray_cannon.png",
      dim: [5,5],
      game: this.game,
      caster: this,
      duration: 120,
      sType: "ray",
      sId: "rayCannon",
      tickEvent: function () {
        if (this.isFired) {
          return;
        } else if (this.duration > 10) {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          LW.ParticleSplatter(1, function () {
              var offset = new LW.Coord([Math.random()*5+20,0]);
              offset.plusAngleDeg(Math.random()*360);
              var randPos = this.caster.pos.dup().plus(offset);
              var spell = this;
              return {
                pos: randPos,
                vel: offset.divided(-20),
                game: this.game,
                duration: 20,
                radius: Math.random()*5+5,
                color: 'blue',
                drawType: 'outerRadial',
                radialColor: 'white',
                radialSize: 0.1,
                tickEvent: function () {
                  if (spell.isFired && !this.velChanged) {
                    // sets velocity to go twice lazer's pos over the course of its duration.
                    this.vel.setAngle(spell.vel.toAngle()).plus(spell.pos.dup().minus(this.pos).divided(this.duration/2));
                    this.velChanged = true;
                  }
                }
              };            
            }.bind(this))
        } else {
          this.isFired = true;
          this.game.playSE('thunder.ogg')
          spell.sprite.sizeX = 100;
          spell.sprite.sizeY = 100;
          var collisions = this.game.solidCollisions(this.collBox);
          var spellDir = this.caster.spellDirection().times(3);
          this.vel.plus(spellDir.toUnitVector().divided(10));
          while (!collisions) {
            this.pos.plus(spellDir);
            this.collBox.dim.plus(spellDir.abs());
            // this.vel.plus(spellDir);
            this.sprite.sizeX += 9;
            collisions = this.game.solidCollisions(this.collBox);
          }
          this.wizardColl = function (wizard) {
            if (wizard !== this.caster) {
              wizard.kill(this.caster);
            }
          };
          this.caster.applyMomentum(spellDir.times(-1));
        }
      },
      spellColl: null,
      solidColl: null,
      wizardColl: null
    });
    this.game.playSE('darkness.ogg');
    spell.sprite.sizeX = 1;
    spell.sprite.sizeY = 1;
    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 120;
    return spell;
  };

})();
