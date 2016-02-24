(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  // FIXME: Collision bug going through QUADS.
  var IMAGE_X = 32;
  var IMAGE_Y = 32;
  var DIM = 5;
  var RayCannon = LW.Spell.extend({
    vel: [0,0],
    img: require('graphics/spell_purp_ray_cannon.png'),
    dim: [DIM, DIM],
    duration: 120,
    sType: 'ray',
    sId: 'rayCannon',
    tickEvent: function() {
      if (this.isFired) {
        return;
      }

      if (this.duration > 10) {
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        LW.ParticleSplatter(1, RayCannonBuildParticles.bind(this));
      } else {
        this.isFired = true;
        this.game.playSE('thunder.ogg');
        this.sprite.sizeX = DIM / IMAGE_X * 200;
        this.sprite.sizeY = 100;
        var collisions = this.game.solidCollisions(this.collBox);
        var spellDir = this.caster.spellDirection().times(3);
        this.vel.plus(spellDir.toUnitVector().divided(10));
        while (!collisions) {
          this.pos.plus(spellDir);
          this.collBox.dim.plus(spellDir.abs());

          // this.vel.plus(spellDir);
          this.sprite.sizeX += 600 / IMAGE_X;
          collisions = this.game.solidCollisions(this.collBox);
        }

        this.wizardColl = function(wizard) {
          if (wizard !== this.caster) {
            wizard.kill(this.caster);
          }
        };

        this.caster.applyMomentum(spellDir.times(-1));
      }
    },

    spellColl: null,
    solidColl: null,
    wizardColl: null,
  });

  LW.SpellList.RayCannon = function(spellIndex) {
    var spell = new RayCannon({
      pos: this.pos,
      game: this.game,
      caster: this,
    });
    this.game.playSE('darkness.ogg');
    spell.sprite.sizeX = 1;
    spell.sprite.sizeY = 1;
    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 120;
    return spell;
  };

  var RayCannonBuildParticles = function() {
    var offset = new LW.Coord([Math.random() * 5 + 20,0]);
    offset.plusAngleDeg(Math.random() * 360);
    var randPos = this.caster.pos.dup().plus(offset);
    var _this = this;
    return {
      pos: randPos,
      vel: offset.divided(-20),
      game: this.game,
      duration: 20,
      radius: Math.random() * 5 + 5,
      color: 'blue',
      drawType: 'outerRadial',
      radialColor: 'white',
      radialSize: 0.1,
      tickEvent: function() {
        if (_this.isFired && !this.velChanged) {
          // sets velocity to go twice lazer's pos over the course of its duration.
          this.vel.setAngle(_this.vel.toAngle()).plus(_this.pos.dup().minus(this.pos).divided(this.duration / 2));
          this.velChanged = true;
        }
      },
    };
  };

})();
