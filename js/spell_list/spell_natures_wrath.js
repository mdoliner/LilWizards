(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.NaturesWrath = function(spellIndex) {
    var spell = new LW.Spell({
      pos: this.pos,
      vel: this.spellDirection().times(6).plus(this.vel),
      img: 'graphics/spell_natures_wrath.png',
      dim: [7.5,7.5],
      game: this.game,
      caster: this,
      imgBaseAngle: -45,
      sType: 'static',
      sId: 'naturesWrath',
      initialize: function() {
        this.game.playSE('swing2.ogg');
        this.hit = function() {
          this.duration = 120;
          LW.ParticleSplatter(15, plantHit.bind(this));
          this.vel.divided(1000000);
          this.game.playSE('bullet.ogg');
        };
      },

      tickEvent: function() {
        if (this.victim) {
          if (this.victim.isDead()) {
            this.remove();
          }

          this.pos.setTo(this.victim.pos);
        } else if (this.solidColl) {
          this.vel.plus([0,0.11]);
        }
      },

      wizardColl: function(wizard) {
        if (this.victim || this.caster === wizard) return;

        this.victim = wizard;
        this.solidColl = null;
        this.hit.bind(this)();
      },

      solidColl: function() {
        this.pos.minus(this.vel);
        this.solidColl = null;
        this.wizardColl = null;
        this.hit.bind(this)();
      },

      removeEvent: function() {
        if (this.victim) {
          this.victim.kill(this.caster);
        }

        var dir = new LW.Coord([1,0]);
        this.game.playSE('fire2.ogg');
        for (var i = 0; i < 4; i++) {
          NaturesWrathRocket.bind(this.caster)(spellIndex, dir.dup(), this.pos);
          dir = dir.plusAngleDeg(90);
        }
      },
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 115;
    return spell;
  };

  var NaturesWrathRocket = function(spellIndex, dir, pos) {
    var spell = new LW.Spell({
      pos: pos,
      vel: dir.times(2),
      img: 'graphics/spell_missile.png',
      dim: [5,5],
      game: this.game,
      caster: this,
      imgBaseAngle: 135,
      sType: 'projectile',
      sId: 'naturesWrathRocket',
      initialize: function() {
        this.sprite.sizeX = 50;
        this.sprite.sizeY = 50;
      },

      tickEvent: function() {
        this.vel.times(1.02);
      },

      wizardColl: function(wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill(this.caster);
        }
      },

      removeEvent: function() {
        this.game.playSE('hard_explode.ogg', 0.4);
        LW.ParticleSplatter(12, explodeHit.bind(this));
      },
    });
    this.game.spells.push(spell);
    return spell;
  };

  var plantHit = function() {
    var randVel = this.vel.dup().times([-Math.random(),-Math.random()]).plusAngleDeg(Math.random() * 120 - 60);
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 20 + 10),
      radius: Math.random() * 2 + 1,
      color: 'green',
    };
  };

  var explodeHit = function() {
    var randVel = new LW.Coord([Math.random(),Math.random() * 1.5]).plusAngleDeg(Math.random() * 360);
    var color = ['orange', 'yellow', 'grey', 'black'][Math.floor(Math.random() * 3 + 0.5)];
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 20 + 10),
      radius: Math.random() * 4 + 2,
      color: color,
    };
  };

})();
