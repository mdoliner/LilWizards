(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Game = LW.Game = function(options) {
    this.wizards = [];
    this.tiles = [];
    this.spawnPoints = [];
    this.spikes = [];
    this.movingTiles = [];
    this.spells = [];
    this.spellRemoveQueue = [];
    this.parseLevel(options.level);
    this.particles = new LW.ParticleLibrary;
    this.camera = new LW.Camera({
      pos: [512,288],
      size: 100,
    });
    this.audio = LW.GlobalSL;
    this.background = new LW.Sprite({
      pos: [512,288],
      img: './graphics/' + options.background,
      background: true,
      load: true,
      game: this,
    });
    this.drawAll = true;
  };

  Game.DIMX = 1024;
  Game.DIMY = 576;
  Game.MAX_ZOOM = 125;

  Game.prototype.step = function() {
    if (false && this.camera.move.time <= 0) {
      this.adjustCamera();
    }

    this.isOver();
    this.camera.step();
    var i;
    for (i = 0; i < this.movingTiles.length; i++) {
      this.movingTiles[i].step();
    }

    for (i = 0; i < this.wizards.length; i++) {
      this.wizards[i].step();
    }

    for (i = 0; i < this.spells.length; i++) {
      this.spells[i].move();
    }

    this.emptyRemoveQueue();
    this.particles.move();
  };

  Game.prototype.playSE = function(src, volume) {
    volume = volume || 0.8;
    this.audio.playSE(src, volume);
  };

  Game.prototype.adjustCamera = function() {
    var arrX = [];
    var arrY = [];
    this.wizards.forEach(function(wizard) {
      arrX.push(wizard.pos.x);
      arrY.push(wizard.pos.y);
    }.bind(this));

    arrX = arrX.sort((function(a,b) {return a - b; }));

    arrY = arrY.sort((function(a,b) {return a - b; }));

    var avgX = (arrX[0] + arrX[arrX.length - 1]) / 2;
    var avgY = (arrY[0] + arrY[arrY.length - 1]) / 2;
    var magX = Game.DIMX / (Math.abs(avgX - arrX[arrX.length - 1]) * 3) * 100;
    var magY = Game.DIMY / (Math.abs(avgY - arrY[arrY.length - 1]) * 3) * 100;
    var mag = Math.min(magX, magY, Game.MAX_ZOOM);
    this.camera.moveTo({
      endPos: [avgX, avgY],
      endSize: mag,
      moveType: 'linear',
      duration: 20,
    });
  };

  Game.prototype.draw = function(fgctx, bgctx) {
    //var allObjects = this.allObjects();
    var fgObjects = this.fgObjects();
    var i;

    fgctx.clearRect(0, 0, 1024, 576);
    for (i = 0; i < fgObjects.length; i++) {
      fgObjects[i].draw(fgctx, this.camera);

      // COLLISION BOX DEBUG CODE:
      // if (allObjects[i] instanceof LW.Wizard) {
      //   allObjects[i].collBox.draw(ctx, this.camera, "white")
      // } else if (allObjects[i] instanceof LW.Spell) {
      //   allObjects[i].collBox.draw(ctx, this.camera, "red")
      // }
    }

    this.particles.draw(fgctx, this.camera);
    if (this.camera.hasMoved || this.drawAll) {
      var bgObjects = this.bgObjects();
      this.camera.hasMoved = false;
      this.drawAll = false;
      bgctx.clearRect(0, 0, 1024, 576);
      this.background.draw(bgctx, this.camera);
      for (i = 0; i < bgObjects.length; i++) {
        bgObjects[i].draw(bgctx, this.camera);
      }
    }

    for (i = 0; i < this.wizards.length; i++) {
      if (this.wizards[i].isDead()) continue;

      var newPos = this.camera.relativePos(this.wizards[i].pos);
      fgctx.font = '15px Sans-serif';
      fgctx.strokeStyle = 'black';
      fgctx.lineWidth = 3;
      fgctx.strokeText(this.wizards[i].kills, newPos.x, newPos.y - 32);
      if (this.wizards[i].controllerType === 'computer') {
        fgctx.fillStyle = 'red';
      } else {
        fgctx.fillStyle = 'white';
      }

      fgctx.fillText(this.wizards[i].kills, newPos.x, newPos.y - 32);
    }
  };

  Game.prototype.remove = function(obj) {
    if (obj instanceof LW.Spell) {
      this.spellRemoveQueue.push(obj);
    } else if (obj instanceof LW.Particle) {
      var index = this.particles.indexOf(obj);
      if (index < 0) {
        return;
      }

      this.particles.spliceOne(index);
    }
  };

  Game.prototype.emptyRemoveQueue = function() {
    for (var i = 0; i < this.spellRemoveQueue.length; i++) {
      var spell = this.spellRemoveQueue[i];
      var index = this.spells.indexOf(spell);

      if (index < 0) {
        continue;
      }

      this.spells.splice(index, 1);
    }

    this.spellRemoveQueue = [];
  };

  Game.prototype.solidObjects = function() {
    return this.tiles.concat(this.spikes).concat(this.movingTiles);
  };

  Game.prototype.allObjects = function() {
    return this.tiles.concat(this.spawnPoints).concat(this.wizards).concat(this.spells);
  };

  Game.prototype.fgObjects = function() {
    return this.wizards.concat(this.spells).concat(this.particles).concat(this.movingTiles);
  };

  Game.prototype.bgObjects = function() {
    return this.tiles.concat(this.spikes).concat(this.spawnPoints);
  };

  Game.prototype.solidCollisions = function(collBox) {
    return this.allCollisions(collBox, this.solidObjects());
  };

  Game.prototype.spellCollisions = function(collBox) {
    return this.allCollisions(collBox, this.spells);
  };

  Game.prototype.wizardCollisions = function(collBox) {
    return this.allCollisions(collBox, $.grep(this.wizards, function(wizard) {
      return !wizard.isDead();
    }));
  };

  Game.prototype.allCollisions = function(collBox, objArray) {
    var collisions = [];
    for (var i = 0; i < objArray.length; i++) {
      if (collBox === objArray[i].collBox) continue;

      var collision = collBox.collision(objArray[i]);
      if (collision !== false) {
        collisions.push(collision);
        if (objArray[i].onCollision) objArray[i].onCollision(collBox.parent);
      }
    }

    if (collisions.length === 0) {
      return false;
    } else {
      return collisions;
    }
  };

  Game.prototype.parseLevel = function(level) {
    var objects = LW.LevelParser(level);
    this.tiles = objects.tiles;
    this.spawnPoints = objects.spawnPoints;
    this.movingTiles = objects.movingTiles;
    this.spikes = objects.spikes;
  };

  Game.prototype.getSpawnPointPos = function(wizard) {
    var randomSpawn = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    var collisions = this.wizardCollisions(randomSpawn.collBox);
    while (collisions && collisions.indexOf(wizard) < 0) {
      randomSpawn = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
      collisions = this.wizardCollisions(randomSpawn.collBox);
    }

    return randomSpawn.pos;
  };

  Game.prototype.isOver = function() {
    if (this.gameEnding) {return;}

    for (var i = 0; i < this.wizards.length; i++) {
      if (this.wizards[i].kills >= LW.Settings.WinKills) {
        this.endGame(this.wizards[i]);
        return true;
      }
    }

    return false;
  };

  Game.prototype.endGame = function(winner) {
    this.gameEnding = true;
    this.playSE('applause.ogg', 100);
    $('#bgm').animate({volume: 0}, 4000);
    var victoryFollow = setInterval(function() {
      var duration;
      if (this.camera.size <= 380) {
        duration = 60;
      } else {
        duration = 30;
      }

      this.camera.moveTo({
        endPos: winner.pos,
        endSize: 400,
        moveType: 'linear',
        duration: duration,
      })
    }.bind(this), 1000 / 60);
    setTimeout(function() {
      this.gameEnded = true;
      clearInterval(victoryFollow);
    }.bind(this), 5000);
  };

  var ParticleTest = function() {
    var randVel = new LW.Coord([Math.random() / 4, 0]).plusAngleDeg(Math.random() * 360);
    return {
      pos: [512,256],
      vel: randVel,
      game: this,
      duration: 1800,
      radius: Math.random() * 5 + 15,
      color: 'red',
      drawType: 'square',
      radialSize: 0.05,
      radialColor: 'white',
      tickEvent: function() {
        this.color.hue += 3;
      },
    };
  };

})();
