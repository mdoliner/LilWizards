(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var MAX_VEL_X_CHANGE = 1.6;
  var ACCEL_X_CHANGE = 1.6;
  var N_GRAVITY_CHANGE = 1.1;
  var J_GRAVITY_CHANGE = 0.5;

  var BerserkAilment = LW.Ailment.extend({
    sType: 'misc',
    sId: 'berserk',
    duration: 300,
    initialize: function() {
      this.game.playSE('boost.ogg');
      this.colors = ['white', 'gold', 'orange', 'papayawhip', 'orangered'];
      this.victim.maxVelX *= MAX_VEL_X_CHANGE;
      this.victim.accelXModifier *= ACCEL_X_CHANGE;
      this.victim.nGravity *= N_GRAVITY_CHANGE;
      this.victim.jGravity *= J_GRAVITY_CHANGE;
      LW.ParticleSplatter(40, startParticles.bind(this));
    },

    tickEvent: function() {
      if (this.victim.isDead()) {
        this.remove();
      } else {
        this.victim.globalCooldown -= 3;
        for (var i = 0; i < this.victim.cooldownList.length; i++) {
          if (i === this.spellIndex) {continue;}

          this.victim.cooldownList[i] -= 3;
        }

        LW.ParticleSplatter(2, tickParticles.bind(this));
      }
    },

    removeEvent: function() {
      this.victim.maxVelX /= MAX_VEL_X_CHANGE;
      this.victim.accelXModifier /= ACCEL_X_CHANGE;
      this.victim.nGravity /= N_GRAVITY_CHANGE;
      this.victim.jGravity /= J_GRAVITY_CHANGE;
      this.game.playSE('debuff.ogg');
      this.victim.globalCooldown = 560;
      this.victim.cooldownList[this.spellIndex] = 660;
      var ending = setInterval(function() {
        LW.ParticleSplatter(2, endParticles.bind(this));
        if (this.victim.globalCooldown <= 20 || this.victim.isDead()) {
          clearInterval(ending);
        }
      }.bind(this), 1000 / 60);
    },
  });

  LW.SpellList.Berserk = function(spellIndex) {
    var ailment = new BerserkAilment({
      game: this.game,
      wizard: this,
      victim: this,
      spellIndex: spellIndex,
    });
    this.addAilment(ailment);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 360;
    return ailment;
  };

  var tickParticles = function() {
    var randVel = (new LW.Coord(2)).times(Math.random()).plusAngleDeg(Math.random() * 360);
    return {
      pos: this.victim.pos.dup(),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 10 + 5),
      radius: Math.random() * 2 + 1,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    };
  };

  var startParticles = function() {
    var randVel = (new LW.Coord(1.2)).plusAngleDeg(Math.random() * 360);
    return {
      pos: this.victim.pos.dup(),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 15 + 20),
      radius: Math.random() * 3 + 3,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    };
  };

  var endParticles = function() {
    var randVel = new LW.Coord([0,1]);
    return {
      pos: this.victim.pos.dup().plus([Math.random() * 24 - 12, -21 + Math.random() * 10]),
      vel: randVel,
      game: this.game,
      duration: Math.floor(Math.random() * 15 + 20),
      radius: Math.random() * 2 + 1,
      color: 'papayawhip',
      tickEvent: function() {
        this.vel.y += 0.01;
      },
    };
  };

})();
