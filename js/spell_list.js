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
      vel: this.spellDirection().times([20,20]).plusAngleDeg(90),
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
        this.vel.plusAngleDeg(-9);
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
      removeEvent: function () {
        LW.ParticleSplatter(5, function () {
          var randVel = this.vel.dup().times([-Math.random(),-Math.random()]).plusAngleDeg(Math.random()*120-60)
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+10),
            radius: Math.random()*2+1,
            color: 'grey'
          };
        }.bind(this))
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  };

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.Crash = function (spellIndex) {
    if (this.onGround) {return;}
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,15],
      img: "graphics/spell_crash.png",
      dim: [10,5],
      game: this.game,
      caster: this,
      duration: -1,
      sType: "melee",
      sId: "crash",
      tickEvent: function () {
        if (this.impact) {
          this.collBox.dim[0] += 2
          this.collBox.dim[1] += 1
        } else {
          this.caster.vel.y = 10;
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          if (this.caster.onGround) {
            this.impact = true;
            this.game.camera.startShake({power: 4, direction: 'x', duration: 15})
            this.duration = 15;
            this.caster.vel.x = 0;
            this.vel.y = 0;
            LW.ParticleSplatter(40, function () {
              var randVel = new LW.Coord([-Math.random()*4,0]).plusAngleDeg(Math.floor(Math.random()*2)*180);
              var color = ['blue', 'purple', 'white'][Math.floor(Math.random()*3)];
              return {
                pos: this.pos,
                vel: randVel,
                game: this.game,
                duration: Math.floor(Math.random()*20+15),
                radius: Math.random()*5+1,
                color: color,
                tickEvent: function () {
                  this.vel.plusUpAngleDeg((4-this.vel.toScalar())*2);
                }
              };
            }.bind(this))
          }
        }
      },
      spellColl: null,
      solidColl: null,
    });
    spell.sprite.sizeX = 200;
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  };

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.RayCannon = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_ray_cannon.png",
      dim: [5,5],
      game: this.game,
      caster: this,
      duration: 250,
      sType: "ray",
      sId: "rayCannon",
      tickEvent: function () {
        if (this.isFired) {
          return;
        } else if (this.duration > 10) {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
        } else {
          this.isFired = true;
          var collisions = this.game.solidCollisions(this.collBox);
          while (!collisions) {
            
          }
        }
      },
      spellColl: null,
      solidColl: null,
      wizardColl: null
    });
    spell.sprite.sizeX = 1;
    spell.sprite.sizeY = 1;
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 60;
    return spell;
  };

})();
