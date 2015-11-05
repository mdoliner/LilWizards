(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var CrashSpell = LW.Spell.extend({
    vel: [0,15],
    img: 'graphics/spell_crash2.png',
    dim: [10,5],
    imgBaseAngle: 90,
    duration: -1,
    sType: 'melee',
    sId: 'crash',
    tickEvent: function() {
      if (this.impact) {
        this.collBox.dim.x += 3;
        this.collBox.dim.y += 0.2;
        this.sprite.sizeY += 10;
        this.sprite.sizeX += 10;
      } else {
        this.caster.vel.y = 10;
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        if (this.caster.onGround) {
          this.caster.wallHangOveride = false;
          this.impact = true;
          this.game.camera.startShake({power: 4, direction: 'y', duration: 15});
          this.duration = 15;
          this.caster.vel.x = 0;
          this.caster.applyMomentum([0,-15]);
          this.vel.y = 0.1;
          this.game.playSE('explode.ogg', 0.5);
          LW.ParticleSplatter(40, CrashParticles.bind(this));
        }
      }
    },
  });

  LW.SpellList.Crash = function(spellIndex) {
    if (this.onGround) {
      this.game.playSE('fail.ogg', 0.5);
      LW.ParticleSplatter(10, function() {
        var randVel = new LW.Coord([-Math.random() * 4,0]).plusAngleDeg(Math.floor(Math.random() * 2) * 180);
        return {
          pos: this.pos,
          vel: randVel,
          game: this.game,
          duration: Math.floor(Math.random() * 20 + 15),
          radius: Math.random() * 5 + 1,
          color: 'grey',
          tickEvent: function() {
            this.vel.plusUpAngleDeg((4 - this.vel.toScalar()) * 2);
          },
        };
      }.bind(this));
      return;
    }

    var spell = new CrashSpell({
      pos: this.pos,
      game: this.game,
      caster: this,
      spellColl: null,
      solidColl: null,
    });

    spell.sprite.sizeY = 100;
    spell.sprite.sizeX = 100;
    this.game.playSE('fire.ogg');
    this.wallHangOveride = true;
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 70;
    return spell;
  };

  var CrashParticles = function() {
    var randVel = new LW.Coord([-Math.random() * 4,0]).plusAngleDeg(Math.floor(Math.random() * 2) * 180);
    var color = ['orange', 'yellow', 'white'][Math.floor(Math.random() * 3)];
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 20 + 15),
      radius: Math.random() * 5 + 1,
      color: color,
      tickEvent: function() {
        this.vel.plusUpAngleDeg((4 - this.vel.toScalar()) * 2);
      },
    };
  };

})();
