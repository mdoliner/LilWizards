(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SpellList = LW.SpellList = {};

  SpellList.Fireball = function (spellIndex) {
    var fireball = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([6, 6]),
      img: "graphics/spell_fireball.gif",
      dim: [5,5],
      game: this.game,
      caster: this,
      tickEvent: function () {
      },
      wizardColl: function (wizard) {
        if (wizard !== this.caster) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      removeEvent: function () {
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
      }
    });
    this.game.spells.push(fireball);
    this.globalCooldown = 10;
    this.cooldownList[spellIndex] = 30;
    this.vel.minus(this.spellDirection().times([3,3]));
  }

  // =====================================================================
  // =====================================================================
  // =====================================================================



  SpellList.Sword = function (spellIndex) {
    var sword = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([20,20]).plusAngleDeg(-90),
      img: "graphics/spell_sword.png",
      dim: [22.5,5],
      game: this.game,
      caster: this,
      duration: 20,
      imgBaseAngle: 225,
      tickEvent: function () {
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        this.vel.plusAngleDeg(9);
      },
      spellColl: function (spell) {
        if (spell.caster === this.caster) {return;};
        spell.caster = this.caster;
        spell.vel.times([-1.1,-1.1]);
      },
      solidColl: function () {}
    });
    this.game.spells.push(sword);
    this.globalCooldown = 10;
    this.cooldownList[spellIndex] = 30;
    this.vel.plus(this.spellDirection().times([3,3]))
  }

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.Candy = function (spellIndex) {
    var candy = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_candy.png",
      imgSizeX: 10,
      imgSizeY: 10,
      dim: [4.5, 4.5],
      game: this.game,
      caster: this,
      tickEvent: function () {
        if (this.mineBuffer === undefined) {
          this.mineBuffer = 60;
        }
        this.mineBuffer -= 1;
        if (this.mineBuffer <= 0) {
          this.sprite.baseAngle += 1;
        } else {
          this.sprite.sizeX += 0.5;
          this.sprite.sizeY += 0.5;
        }
      },
      wizardColl: function (wizard) {
        if (this.mineBuffer <= 0) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      spellColl: function (spell) {
        spell.remove();
        this.remove();
      },
      removeEvent: function () {
        LW.ParticleSplatter(40, function () {
          var randVel = new LW.Coord([Math.random()*5,Math.random()*5]).plusAngleDeg(Math.random()*360);
          var color = ['orange', 'yellow', 'grey', 'black'][Math.floor(Math.random()*3 + 0.5)];
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+10),
            radius: Math.random()*5+1,
            color: color
          };
        }.bind(this))
      }
    });
    this.game.spells.push(candy);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 45;
  }

})();
