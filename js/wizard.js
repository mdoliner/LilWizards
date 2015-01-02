(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Wizard = LW.Wizard = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);
    this.horFacing = options.horFacing;
    this.verFacing = null;

    this.sprite = new LW.Sprite({
      img: options.img,
      parent: this,
      indexXMax: options.imgIndexXMax,
      indexYMax: options.imgIndexYMax,
      sizeX: options.imgSizeX,
      sizeY: options.imgSizeY
    });

    this.friction = new LW.Coord([.870, 1]);
    this.gravity = new LW.Coord([0, Wizard.N_GRAVITY]); //HELP ME

    this.game = options.game;

    this.collBox = new LW.CollBox(this.pos, [12, 12]);
    this.onGround = false;
    this.boosted = false;
    this.wallJumpBuffer = 0;
    this.wallHangOveride = false;
    this.deadTimer = -1;

    this.spellList = [ LW.SpellList.Crash, LW.SpellList.FanOfKnives, LW.SpellList.RayCannon];
    this.cooldownList = [0, 0, 0];
    this.globalCooldown = 0;
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

  Wizard.MAX_VEL_X = 5;
  Wizard.N_GRAVITY = 0.18;
  Wizard.J_GRAVITY = 0.07;

  Wizard.prototype.draw = function (ctx, camera) {
    if (this.isDead()) {return;}
    if (this.verFacing === "up") {
      this.sprite.angle = -30;
    } else if (this.verFacing === "down") {
      this.sprite.angle = 30;
    } else {
      this.sprite.angle = 0;
    }
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
    }
  };

  Wizard.prototype.move = function () {
    this.onGround = false;
    this.wallJumpBuffer -= 1;

    this.pos.x += this.vel.x;
    var collisions = this.game.solidCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthX = (this.collBox.dim.x + oB.dim.x) - Math.abs(this.pos.x - oB.pos.x);
        if (this.pos.x > oB.pos.x ) {
          this.pos.x += depthX;
          this.onLeftWall = true;
        } else {
          this.pos.x -= depthX;
          this.onRightWall = true;
        }
        this.vel.x = 0;
      }
    }

    if (this.isOnWall() && (this.horFacing === "left" || this.horFacing === "right") && !this.wallHangOveride) {
      this.vel.y = Math.min(this.vel.y, 1);
      this.boosted = false;
    }

    this.pos.y += this.vel.y;
    var collisions = this.game.solidCollisions(this.collBox);
    if (collisions) {
      for (var i = 0; i < collisions.length; i++) {
        var oB = collisions[i].collBox;
        var depthY = (this.collBox.dim.y + oB.dim.y) - Math.abs(this.pos.y - oB.pos.y);
        if (this.pos.y > oB.pos.y ) {
          this.pos.y += depthY;
        } else {
          this.pos.y -= depthY;
          this.touchGround();
        }
        this.vel.y = 0.1;
      }
    }

    if (!this.onGround) {
      this.vel.plus(this.gravity);
    } else {
      this.vel.times(this.friction);
    }

    this.gravity.y = Wizard.N_GRAVITY;

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
    } else if ((this.onLeftWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = Wizard.MAX_VEL_X;
      this.onLeftWall = false;
      this.faceDir("right");
    } else if ((this.onRightWall && this.isOnWall()) || this.wallJumpBuffer > 0) {
      this.vel.y = val;
      this.vel.x = -Wizard.MAX_VEL_X;
      this.onRightWall = false;
      this.faceDir("left");
    } else {
      return;
    }
    this.game.playSE('jump.ogg');
  };

  Wizard.prototype.accelX = function (val) {
    if (!this.onGround) {
      val /= 3.5;
    }
    if (Math.abs(this.vel.x + val) < Wizard.MAX_VEL_X) {
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
  };

  Wizard.prototype.dynamicJump = function () {
    if (this.vel.y < -2) {
      this.gravity.y = Wizard.J_GRAVITY;
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
        radius: Math.random()*4+1,
        color: 'red',
        tickEvent: function () {
          this.vel.y += 0.11;
          this.radius -= 0.01;
        }
      };
    }.bind(this))

    this.game.camera.startShake({power: 3, direction: 'x', duration: 20})
    this.game.playSE('death.ogg');

    this.deadTimer = 120;
    this.pos.setTo(-1000);

    this.removeActiveSpells();
  };

  Wizard.prototype.isDead = function () {
    return this.deadTimer >= 0;
  }

  Wizard.prototype.revive = function () {
    this.pos.setTo(this.game.getSpawnPointPos(this));
    this.vel.setTo(0);
    this.game.playSE('revive.ogg');

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
  }

  Wizard.prototype.removeActiveSpells = function () {
    for (var i = this.game.spells.length - 1; i >= 0; i--) {
      var spell = this.game.spells[i];
      if (spell.caster === this && "ray melee".indexOf(spell.sType) >= 0) {
        this.game.spells.splice(i, 1);
      }
    };
  }

  Wizard.prototype.castSpell = function (spellIndex) {
    if (this.globalCooldown <= 0 && this.cooldownList[spellIndex] <= 0) {
      this.spellList[spellIndex].bind(this)(spellIndex);
    }
  };

})();
