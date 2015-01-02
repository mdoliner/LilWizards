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
        this.game.playSE('fire2.ogg');
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
    this.game.playSE('fire.ogg');
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
      vel: this.spellDirection().times(30).plusAngleDeg(90),
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
        this.collBox.dim.setTo(this.vel).max(5);
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
    this.game.playSE('sword.ogg');
    this.game.spells.push(spell);
    this.globalCooldown = 10;
    this.cooldownList[spellIndex] = 30;
    this.applyMomentum(this.spellDirection().times(4))
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
          this.mineBuffer = 120;
        }
        this.mineBuffer -= 1;
        if (this.mineBuffer <= 0) {
          this.sprite.baseAngle += 1;
        } else {
          this.sprite.sizeX += 0.25;
          this.sprite.sizeY += 0.25;
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
        if (spell.sId === "candy" || spell.sId === "forcePush") {return;}
        if (spell.sType !== "ray") {
          spell.remove();
        }
        this.remove();
      },
      removeEvent: function () {
        this.game.playSE('candy_explode.ogg');
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
    this.game.playSE('candy_make.ogg');
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
      dim: [2,2],
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
          this.collBox.dim.plus(3);
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
        this.game.playSE('metal_ping.ogg');
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
    this.game.playSE('swing.ogg');
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
          this.collBox.dim.x += 2;
          this.collBox.dim.y += 0.4;
          spell.sprite.sizeY += 40;
        } else {
          this.caster.vel.y = 10;
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          if (this.caster.onGround) {
            this.caster.wallHangOveride = false;
            this.impact = true;
            this.game.camera.startShake({power: 4, direction: 'y', duration: 15})
            this.duration = 15;
            this.caster.vel.x = 0;
            this.caster.applyMomentum([0,-15]);
            this.vel.y = 0.1;
            this.game.playSE('explode.ogg');
            LW.ParticleSplatter(40, function () {
              var randVel = new LW.Coord([-Math.random()*4,0]).plusAngleDeg(Math.floor(Math.random()*2)*180);
              var color = ['red', 'yellow', 'white'][Math.floor(Math.random()*3)];
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
    spell.sprite.sizeY = 100;
    spell.sprite.sizeX = 50;
    this.game.playSE('fire.ogg')
    this.wallHangOveride = true;
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 70;
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
      duration: 120,
      sType: "ray",
      sId: "rayCannon",
      tickEvent: function () {
        if (this.isFired) {
          return;
        } else if (this.duration > 10) {
          this.pos.x = this.caster.pos.x;
          this.pos.y = this.caster.pos.y;
          LW.ParticleSplatter((180 - this.duration)/60, function () {
              var offset = new LW.Coord([20,20]);
              offset.plusAngleDeg(Math.random()*360);
              var randPos = this.caster.pos.dup().plus(offset);
              var spell = this;
              return {
                pos: randPos,
                vel: offset.divided(-20),
                game: this.game,
                duration: 20,
                radius: Math.random()*5+1,
                color: 'blue',
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
    this.globalCooldown = 60;
    this.cooldownList[spellIndex] = 180;
    return spell;
  };

  // =====================================================================
  // =====================================================================
  // =====================================================================

  SpellList.ForcePush = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: this.spellDirection().times(6.7),
      img: "graphics/spell_push.gif",
      dim: [8,8],
      game: this.game,
      caster: this,
      duration: 30,
      sType: "ray",
      sId: "forcePush",
      tickEvent: function () {
        this.sprite.sizeY += 1.79;
        this.collBox.dim.plus(this.vel.dup().plusAngleDeg(90).abs().times(0.2));
      },
      initialize: function () {
        this.game.playSE('wind.ogg');
        this.sprite.sizeX = 33;
        this.sprite.sizeY = 7.16;
      },
      spellColl: function (spell) {
        if (spell.sType === "projectile") {
          spell.vel.setAngle(this.vel.toAngle()).times(1.1);
          spell.caster = this.caster;
        }
        if (spell.sType === "static") {
          spell.vel.setTo(this.vel);
          if (!spell.hitByForcePush) {
            spell.hitByForcePush = true
            var oldFunc = spell.tickEvent.bind(spell);
            spell.tickEvent = function () {
              spell.vel.divided(1.2);
              oldFunc();
            }
          }
        }
      },
      solidColl: null,
      wizardColl: function (wizard) {
        if (wizard === this.caster) {return;}
        if ((wizard.onGround && this.vel.y > 0) || 
          (this.vel.x < 0 && wizard.collBox.collHor(-2)) || 
          (this.vel.x > 0 && wizard.collBox.collHor(2)) ||
          (this.vel.y < 0 && wizard.collBox.collVer(-2))) {
          wizard.kill(this.caster);
        } else {
          wizard.vel.setTo(this.vel).times(2.7);//.setAngle(wizard.pos.dup().minus(this.pos).toAngle());
          var makeWizardWind = function () {
            LW.ParticleSplatter(2, function () {
              var randVel = new LW.Coord([Math.random()*2+2,0])
              console.log(randVel);
              randVel.setAngle(wizard.vel.toAngle()).times(-1).plusAngleDeg(Math.random()*60-30);
              console.log(randVel);
              return {
                pos: wizard.pos,
                vel: randVel,
                game: this.game,
                duration: Math.floor(Math.random()*20+10),
                radius: Math.random()*2+2,
                color: "orange"
              };
            }.bind(this));
            if (wizard.vel.toScalar() > 7) {setTimeout(makeWizardWind, 1000/120);}
          }.bind(this);
          makeWizardWind();
        }
      }
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 180;
    return spell;
  };

})();
