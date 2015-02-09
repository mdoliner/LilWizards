(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.DarkRift = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(10),
      img: "graphics/spell_dark_rift.png",
      dim: [15,15],
      game: this.game,
      caster: this,
      duration: 199,
      sType: "static",
      sId: "darkRift",
      initialize: function () {
        this.game.playSE('dark_rift.ogg', 60);
        this.sprite.sizeX = 10;
        this.sprite.sizeY = 10;
      },
      tickEvent: function () {
        this.sprite.baseAngle += 3
        this.sprite.sizeX = Math.min(this.sprite.sizeX + 1, 60)
        this.sprite.sizeY = Math.min(this.sprite.sizeY + 1, 60)
        this.vel.times(0.96)
        var tickAmount = 50;
        if (this.duration % tickAmount === 0) {
          this.wizardColl = function (wizard) {
            if (wizard !== this.caster) {
              wizard.kill(this.caster);
            }
          };
          LW.ParticleSplatter(tickAmount, pulseParticles.bind(this));
          var pulse = function (obj) {
            var dist = this.pos.dup().minus(obj.pos);
            var distance = dist.toScalar();
            if (distance > 200) { return; }
            distance = Math.max(distance, 60);
            obj.vel.plus(dist.divided(Math.pow(distance / 20, 1.6)))
          }.bind(this)
          this.game.spells.filter(function (spell) {
            return spell.sType === "projectile"
          }.bind(this)).forEach(pulse);
          this.game.wizards.filter(function (wizard) {
            return this.caster !== wizard;
          }.bind(this)).forEach(pulse);
        }
      },
      spellColl: null,
      solidColl: null,
      wizardColl: null,
      removeEvent: function () {
        LW.ParticleSplatter(30, endParticles.bind(this));
        this.game.playSE('sizzle.ogg');
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 150;
    return spell;
  };


  var pulseParticles = function () {
    var offset = (new LW.Coord([200,0])).plusAngleDeg(Math.random()*360);
    var myPos = this.pos
    return {
      pos: this.pos.dup().plus(offset),
      vel: offset.dup().divided(-30).plusAngleDeg(45),
      game: this.game,
      duration: 20,
      radius: Math.random()*2+2,
      color: "white",
      tickEvent: function () {
        this.vel.setAngle(this.vel.dup().plus(myPos.dup().minus(this.pos).divided(400)).toAngle());
      }
    };
  };

  var endParticles = function () {
    var randVel = new LW.Coord(Math.random()*2).plusAngleDeg(Math.random()*360)
    return {
      pos: this.pos,
      vel: randVel,
      game: this.game,
      duration: Math.random()*20+20,
      radius: Math.random()*2+2,
      color: "white"
    };
  };

})();
