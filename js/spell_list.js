(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SpellList = LW.SpellList = {};

  SpellList.Fireball = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([6, 6]),
      img: "graphics/spell_fireball.gif",
      dim: [5,5],
      game: this.game,
      caster: this,
      sType: "projectile",
      sId: "fireball",
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
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 30;
    this.applyMomentum(this.spellDirection().times([-3,-3]));
    return spell;
  }

  // =====================================================================
  // =====================================================================
  // =====================================================================



  SpellList.Sword = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([20,20]).plusAngleDeg(-90),
      img: "graphics/spell_sword.png",
      dim: [22.5,5],
      game: this.game,
      caster: this,
      duration: 20,
      imgBaseAngle: 225,
      sType: "melee",
      sId: "sword",
      tickEvent: function () {
        this.pos.x = this.caster.pos.x;
        this.pos.y = this.caster.pos.y;
        this.vel.plusAngleDeg(9);
      },
      spellColl: function (spell) {
        if (spell.caster === this.caster) {return;};
        if (spell.sType === "projectile") {
          spell.caster = this.caster;
          spell.vel.times([-1.1,-1.1]);
        }
      },
      solidColl: null
    });
    this.game.spells.push(spell);
    this.globalCooldown = 10;
    this.cooldownList[spellIndex] = 30;
    this.applyMomentum(this.spellDirection().times([3,3]))
    return spell;
  }

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.Candy = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_candy.png",
      imgSizeX: 10,
      imgSizeY: 10,
      dim: [18, 18],
      game: this.game,
      caster: this,
      sType: "static",
      sId: "candy",
      tickEvent: function () {
        if (this.mineBuffer === undefined) {
          this.mineBuffer = 30;
        }
        this.mineBuffer -= 1;
        if (this.mineBuffer <= 0) {
          this.sprite.baseAngle += 1;
        } else {
          this.sprite.sizeX += 1;
          this.sprite.sizeY += 1;
        }
      },
      wizardColl: function (wizard) {
        if (this.mineBuffer <= 0) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      solidColl: null,
      spellColl: function (spell) {
        if (spell.sId === "candy") {return;}
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
    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 45;
    return spell;
  }

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.FanOfKnives = function (spellIndex, isChild) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times([15,15]).plusAngleDeg(-45),
      img: "graphics/spell_shuriken.gif",
      dim: [5,5],
      game: this.game,
      caster: this,
      duration: -1,
      sType: "melee",
      sId: "fanOfKnives",
      tickEvent: function () {
        this.sprite.baseAngle += 1;
        if (this.isFired) {
          return;
        } else if (this.caster.actions["spells"][spellIndex] === "release" || 
                  (this.caster.actions["spells"][spellIndex] === "none" && !this.isFired) ) {
          this.vel.divided([3,3]);
          this.isFired = true;
          this.sType = "projectile"
          this.solidColl = function () {
            if (this.isFired) {
              this.remove();
            }
          }
        } else if (this.caster.actions["spells"][spellIndex] === "hold") {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          if (isChild) {return;}
          this.childGen = this.childGen + 1 || 1;
          if (this.childGen <= 90 && this.childGen % 30 === 0) {
            var newSpell = SpellList.FanOfKnives.bind(this.caster)(spellIndex, true);
            newSpell.vel = this.vel.dup().plusAngleDeg(this.childGen);
          }
        } 
      },
      spellColl: null,
      solidColl: null,
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  }

})();
