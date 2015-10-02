(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var TeleportSpell = LW.Spell.extend({
    img: 'graphics/spell_teleport.png',
    dim: [12,12],
    sType: 'ray',
    sId: 'teleport',
    initialize: function() {
      this.game.playSE('teleport.ogg');
    },

    tickEvent: function() {
      var action = this.caster.actions.spells[this.spellIndex];
      if (action === 'release' || action === 'none') {
        this.pos.min([LW.Game.DIMX, LW.Game.DIMY]);
        this.pos.max(0);
        var collisions;
        collisions = this.game.solidCollisions(this.collBox);
        if (collisions) {
          this.game.playSE('fail.ogg');
          this.remove();
          return;
        }

        collisions = this.game.wizardCollisions(this.collBox);
        if (collisions) {
          collisions.forEach(function(wizard) {
            if (wizard !== this.caster) {
              wizard.kill(this.caster);
            }
          }.bind(this));
        }

        var times = 5;
        this.vel.times(0);
        this.remove();
        var funct = function() {
          LW.ParticleSplatter(3, TeleportParticleLine.bind(this));
          if (times <= 0) {
            this.caster.pos.setTo(this.pos);
            this.game.playSE('light.ogg');
          } else {
            times -= 1;
            setTimeout(funct, 1000 / 120);
          }
        }.bind(this);
        setTimeout(funct, 1000 / 120);
      }
    },

    wizardColl: null,
    spellColl: null,
    solidColl: null,
    removeEvent: function() {
      LW.ParticleSplatter(10, TeleportBurstParticles.bind(this));
    },
  });

  LW.SpellList.Teleport = function(spellIndex) {
    var spell = new TeleportSpell({
      pos: this.pos,
      vel: this.spellDirection().times(13),
      game: this.game,
      caster: this,
      spellIndex: spellIndex,
    });

    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 180;
    return spell;
  };

  var TeleportParticleLine = function() {
    var length = this.caster.pos.dup().minus(this.pos).times(times / 10).plus(this.pos);
    var offset = this.caster.pos.dup().minus(this.pos).toUnitVector().times(-4.5).plusAngleDeg(Math.random() * 120 - 60);
    var randPos = this.pos.randomBetweenLine(length).plus(offset);
    return {
      pos: randPos,
      vel: offset.toUnitVector().times(-1.5),
      game: this.game,
      duration: 30,
      radius: Math.random() * 2 + 1,
      color: 'floralwhite',
    };
  };

  var TeleportBurstParticles = function() {
    var randVel = this.vel.dup().times(Math.random()).plusAngleDeg(Math.random() * 360);
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 10 + 5),
      radius: Math.random() * 2 + 1,
      color: 'white',
    };
  };

})();
