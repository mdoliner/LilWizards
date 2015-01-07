(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);
    this.horFacing = options.horFacing;
    this.verFacing = null;
    this.maxVelX = 5;
    this.nGravity = 0.18;
    this.jGravity = 0.07;
    this.terminalVel = 7;

    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this,
      indexXMax: options.imgIndexXMax,
      indexYMax: options.imgIndexYMax,
      sizeX: options.imgSizeX,
      sizeY: options.imgSizeY,
      animationReset: function () {
        if (this.verFacing === "up") {
          if (this.sprite.indexYMax >= 4) {
            this.sprite.indexY = 2
          } else {
            this.sprite.angle = -30;
          }
        } else if (this.verFacing === "down") {
          if (this.sprite.indexYMax >= 4) {
            this.sprite.indexY = 3
          } else {
            this.sprite.angle = 30;
          }
        } else {
          if (this.indexYMax >= 4) {
            this.sprite.indexY = 0
          } else {
            this.sprite.angle = 0;
          }
        }
      }.bind(this)
    });

    this.friction = new LW.Coord([.870, 1]);
    this.gravity = new LW.Coord([0, this.nGravity]); //HELP ME

    this.game = options.game;

    this.collBox = new LW.CollBox(this, [12, 12]);
    this.onGround = false;
    this.boosted = false;
    this.wallJumpBuffer = 0;
    this.wallHangOveride = false;
    this.deadTimer = -1;

    this.spellList = options.spellList || [ LW.SpellList.ForcePush, LW.SpellList.Candy, LW.SpellList.Fireball];
    this.cooldownList = [0, 0, 0];
    this.globalCooldown = 0;
    this.ailments = [];
    this.kills = 0;
    this.actions = { // none, tap, hold, release
      jump: "none",
      spells: ["none", "none", "none"],
      left: "none",
      right: "none",
      up: "none",
      down: "none"
    };
  };

  Wizard.TOTAL_SPELL_LIST = [
    LW.SpellList.Crash,
    LW.SpellList.FanOfKnives,
    LW.SpellList.RayCannon,
    LW.SpellList.Fireball,
    LW.SpellList.Candy,
    LW.SpellList.Sword,
    LW.SpellList.ForcePush,
    LW.SpellList.Teleport,
    LW.SpellList.Wave,
    LW.SpellList.Confusion
  ];

  Wizard.prototype.draw = function (ctx, camera) {
    if (this.isDead()) {return;}
    // if (this.verFacing === "up") {
    //   this.sprite.angle = -30;
    // } else if (this.verFacing === "down") {
    //   this.sprite.angle = 30;
    // } else {
    //   this.sprite.angle = 0;
    // }
    this.sprite.animate();
    this.sprite.draw(ctx, camera);
  };

  Wizard.prototype.step = function () {
    if (this.isDead()) {
      this.deadTimer -= 1;
      if (this.deadTimer < 0) {
        this.revive();
      }
    } else {
      this.move();
      this.ailments.forEach(function (ailment) {
        ailment.step();
      });
    }
  };

  Wizard.prototype.remove = function (obj) {
    if (obj instanceof LW.Ailment) {
      var index = this.ailments.indexOf(obj);
      if (index < 0) {
        return;
      }
      this.ailments.splice(index, 1);
    }
  };

  Wizard.prototype.addAilment = function (ailment) {
    this.ailments.push(ailment);
  };

  Wizard.prototype.move = function () {
    this.onGround = false;
    this.wallJumpBuffer -= 1;
    var that = this;

    this.collBox.removeCollision("x",this.vel.x,{
      isCollision: function () {
        that.vel.x = 0;
      },
      leftCollision: function () {
        that.onLeftWall = true;
      },
      rightCollision: function () {
        that.onRightWall = true;
      }
    })

    if (this.isOnWall() && (this.horFacing === "left" || this.horFacing === "right") && !this.wallHangOveride) {
      this.vel.y = Math.min(this.vel.y, 1);
      this.boosted = false;
    }

    this.collBox.removeCollision("y",this.vel.y,{
      isCollision: function () {
        that.vel.y = 0.1;
      },
      bottomCollision: function () {
        that.touchGround();
      }
    })

    if (!this.onGround) {
      if (this.vel.y < this.terminalVel) {
        this.vel.plus(this.gravity);
      }
    } else {
      this.vel.times(this.friction);
    }

    this.gravity.y = this.nGravity;

    this.globalCooldown -= 1;
    for (var i = 0; i < this.cooldownList.length; i++) {
      this.cooldownList[i] -= 1;
    }

  };

  Wizard.prototype.isOnWall = function () {
    if (this.onLeftWall) {
      this.pos.x -= 1;
      var collisions = this.game.solidCollisions(this.collBox);
      this.pos.x += 1;
      if (collisions) {
        return true;
      }
    }
    if (this.onRightWall) {
      this.pos.x += 1;
      var collisions = this.game.solidCollisions(this.collBox);
      this.pos.x -= 1;
      if (collisions) {
        return true;
      }
    }

    return false;
  };

  Wizard.prototype.touchGround = function () {
    if (this.vel.y > 5) {
      this.game.playSE('land.ogg', 1);
      var funct = function (isRight) {
        var randVel = (new LW.Coord([1,0])).times(Math.random()*0.5 + 0.5);
        if (isRight) { randVel.times(-1); }
        var randPos = this.pos.dup().plus([8,0]).randomBetween(this.pos.dup().minus([8,0])).plus([0,16]);
        return {
          pos: randPos,
          vel: randVel,
          game: this.game,
          duration: Math.floor(Math.random()*20+20),
          radius: Math.random()*2+3,
          color: 'whitesmoke'
        };
      }
      LW.ParticleSplatter(3, funct.bind(this, false))
      LW.ParticleSplatter(3, funct.bind(this, true))
    }
    this.onGround = true;
    this.boosted = false;
  };

  Wizard.prototype.applyMomentum = function (vec) {
    if (!this.boosted) {
      this.boosted = true;
      this.vel.plus(vec);
    }
  };

  Wizard.prototype.isValidMove = function (move) {
    var currPos = this.pos.dup();
    var nextPos = currPos.plus(move);

    return this.game.isColliding(this);
  };

  Wizard.prototype.jump = function (val) {
    if (this.onGround) {
      this.vel.y = val;
      this.game.playSE('jump_ground.ogg');
      LW.ParticleSplatter(5, function () {
        var randVel = this.vel.dup().plusAngleDeg(Math.random()*40-20).times(Math.random()/3);
        var randPos = this.pos.dup().plus([8,0]).randomBetween(this.pos.dup().minus([8,0])).plus([0,16]);
        return {
          pos: randPos,
          vel: randVel,
          game: this.game,
          duration: Math.floor(Math.random()*20+20),
          radius: Math.random()*2+3,
          color: 'whitesmoke'
        };
      }.bind(this))
      return;
    } else if ((this.onLeftWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = this.maxVelX;
      this.onLeftWall = false;
      this.faceDir("right");
      var offset = [-8,0];
    } else if ((this.onRightWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = -this.maxVelX;
      this.onRightWall = false;
      this.faceDir("left");
      var offset = [8,0];
    } else {
      return;
    }
    this.game.playSE('jump.ogg');
    LW.ParticleSplatter(5, function () {
      var randVel = this.vel.dup().plusAngleDeg(Math.random()*40-20).times(Math.random()/3);
      var randPos = this.pos.dup().plus([0,8]).randomBetween(this.pos.dup().minus([0,8])).plus(offset);
      return {
        pos: randPos,
        vel: randVel,
        game: this.game,
        duration: Math.floor(Math.random()*20+20),
        radius: Math.random()*2+3,
        color: 'whitesmoke'
      };
    }.bind(this))
  };

  Wizard.prototype.accelX = function (val) {
    if (!this.onGround) {
      val /= 3.5;
    } else {
      if (this.sprite.indexYMax >= 2 && this.sprite.indexY !== 1) {
        this.sprite.indexY = 1;
        this.sprite.indexX = 0;
      }
      if (Math.abs(this.vel.x + val) < this.maxVelX - 1 && Math.abs(val) > 0.7) {
        LW.ParticleSplatter(1, function () {
          var randVel = this.vel.dup().times([-0.2,0]).plusUpAngleDeg(Math.random()*30+15)
          var newPos = this.pos.dup().plus([0,16])
          return {
            pos: newPos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+20),
            radius: Math.random()*2+1,
            color: 'whitesmoke'
          };
        }.bind(this))
      }
    }
    if (Math.abs(this.vel.x + val) < this.maxVelX) {
      this.vel.x += val;
    }
  };

  Wizard.prototype.faceDir = function (dir) {
    if (dir === "left") {
      this.sprite.mirror = true;
      if (this.onRightWall) {this.wallJumpBuffer = 10}
      this.onRightWall = false;
      this.horFacing = dir;
    } else if (dir === "right") {
      this.sprite.mirror = false;
      if (this.onLeftWall) {this.wallJumpBuffer = 10}
      this.onLeftWall = false;
      this.horFacing = dir;
    } else if (dir === "up" || dir === "down") {
      this.verFacing = dir;
    }
    this.sprite.animationReset();
  };

  Wizard.prototype.dynamicJump = function () {
    if (this.vel.y < -2) {
      this.gravity.y = this.jGravity;
    }
  };

  Wizard.prototype.spellDirection = function () {
    if (this.verFacing === "up") {
      return new LW.Coord([0, -1]);
    } else if (this.verFacing === "down") {
      return new LW.Coord([0,1]);
    } else if (this.horFacing === "right") {
      return new LW.Coord([1, 0]);
    } else if (this.horFacing === "left") {
      return new LW.Coord([-1, 0]);
    }
  };

  Wizard.prototype.kill = function (killer) {
    if (killer === this) {
      killer.kills -= 1;
    } else {
      killer.kills += 1;
    }
    LW.ParticleSplatter(20, function () {
      var randVel = new LW.Coord([Math.random()*3,Math.random()*3]).plusAngleDeg(Math.random()*360)
      return {
        pos: this.pos,
        vel: randVel,
        game: this.game,
        duration: Math.floor(Math.random()*30+30),
        radius: Math.random()*5+3,
        color: 'red',
        tickEvent: function () {
          this.vel.y += 0.05;
          this.radius -= 0.01;
        }
      };
    }.bind(this))

    this.game.camera.startShake({power: 3, direction: 'x', duration: 20})
    this.game.playSE('death.ogg');

    this.deadTimer = 70 + Math.random() * 80;
    this.pos.setTo(-1000);

    this.removeActiveSpells();
    this.removeAilments();
  };

  Wizard.prototype.isDead = function () {
    return this.deadTimer >= 0;
  }

  Wizard.prototype.revive = function () {
    this.pos.setTo(this.game.getSpawnPointPos(this));
    this.vel.setTo(0);
    this.verFacing = null;
    this.game.playSE('revive.ogg');
    this.cooldownList = [0, 0, 0];
    this.globalCooldown = 0;

    // var listdup = Wizard.TOTAL_SPELL_LIST.slice(0);
    // while (listdup.length > 3) {
    //   listdup.splice(Math.floor(Math.random()*listdup.length),1)
    // }
    // this.spellList = listdup;

    LW.ParticleSplatter(20, function () {
      var randVel = new LW.Coord([Math.random()*3,Math.random()*3]).plusAngleDeg(Math.random()*360)
      return {
        pos: this.pos,
        vel: randVel,
        game: this.game,
        duration: Math.floor(Math.random()*30+30),
        radius: Math.random()*4+1,
        color: 'white'
      };
    }.bind(this))
  };

  Wizard.prototype.removeActiveSpells = function () {
    for (var i = this.game.spells.length - 1; i >= 0; i--) {
      var spell = this.game.spells[i];
      if (spell.caster === this && "ray melee".indexOf(spell.sType) >= 0) {
        this.game.spells.splice(i, 1);
      }
    };
  };

  Wizard.prototype.removeAilments = function () {
    for (var i = this.ailments.length - 1; i >= 0; i--) {
      this.ailments[i].remove();
    };
  };

  Wizard.prototype.castSpell = function (spellIndex) {
    if (this.globalCooldown <= 0 && this.cooldownList[spellIndex] <= 0) {
      this.spellList[spellIndex].bind(this)(spellIndex);
    }
  };

})();
