(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Game = LW.Game = function () {
    this.wizards = [];
    this.wizards.push (new LW.Wizard({
      pos: [300,130],
      vel: [0,0],
      horFacing: "left",
      img: "./graphics/wiz_baby_ani_2.png",
      imgIndexXMax: 4,
      imgIndexYMax: 4,
      imgSizeX: 7.62,
      imgSizeY: 8,
      game: this,
      spellList: [LW.SpellList.Sword, LW.SpellList.Teleport, LW.SpellList.Crash]
    }));
    this.wizards.push (new LW.Wizard({
      pos: [64,64],
      vel: [0,0],
      horFacing: "left",
      img: "./graphics/wiz_baby_ani_2.png",
      imgIndexXMax: 4,
      imgIndexYMax: 4,
      imgSizeX: 7.62,
      imgSizeY: 8,
      game: this,
      spellList: [LW.SpellList.Candy, LW.SpellList.ForcePush, LW.SpellList.Crash]
    }));
    this.wizards.push (new LW.Wizard({
      pos: [-500,130],
      vel: [0,0],
      horFacing: "right",
      img: "./graphics/wiz.png",
      imgIndexXMax: 1,
      imgIndexYMax: 1,
      game: this,
      spellList: [LW.SpellList.Fireball, LW.SpellList.Wave, LW.SpellList.Sword]
    }));
    this.wizards.push (new LW.Wizard({
      pos: [700,130],
      vel: [0,0],
      horFacing: "left",
      img: "./graphics/wiz2.png",
      imgIndexXMax: 1,
      imgIndexYMax: 1,
      game: this,
      spellList: [LW.SpellList.Fireball, LW.SpellList.RayCannon, LW.SpellList.ForcePush]
    }));
    this.tiles = [];
    this.spawnPoints = [];
    this.spells = [];
    this.parseLevel(Game.LEVEL);
    this.particles = [];
    this.camera = new LW.Camera({
      pos: [512,288],
      size: 100 //percent
    });

    this.background = new LW.Sprite({ pos: [512,288], img: "./graphics/bg_bookcase.jpg", background: true })
  };

  Game.LEVEL = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
                [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
                [1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,2,1],
                [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1],
                [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]

  Game.DIMX = 1024;
  Game.DIMY = 576;

  Game.prototype.step = function () {
    if (this.camera.move.time <= 0){
      // this.adjustCamera();
    }

    this.camera.step();

    this.wizards.forEach(function (wizard) {
      wizard.step();
    });
    this.spells.forEach(function (spell) {
      spell.move();
    })
    this.particles.forEach(function (particle) {
      particle.move();
    })
  };

  Game.prototype.playSE = function (src) {
    this.audio.playSE(src);
  };

  Game.prototype.adjustCamera = function () {
    var avgX = 0
    var avgY = 0
    var arrX = []
    var arrY = []
    this.wizards.forEach(function (wizard) {
      avgX += wizard.pos.x / this.wizards.length;
      avgY += wizard.pos.y / this.wizards.length;
      arrX.push(Math.abs(wizard.pos.x-this.camera.pos.x));
      arrY.push(Math.abs(wizard.pos.y-this.camera.pos.y));
    }.bind(this))
    arrX = arrX.sort((function(a,b){return a - b}));
    arrY = arrY.sort((function(a,b){return a - b}));
    this.camera.moveTo({
      endPos: [avgX, avgY],
      endSize: Math.min(Game.DIMX/(Game.DIMX/2-arrX[arrX.length-1])*50, Game.DIMY/(Game.DIMY/2-arrY[arrY.length-1])*50),
      moveType: "linear",
      duration: 1
    })
  };

  Game.prototype.draw = function (fgctx, bgctx) {
    var allObjects = this.allObjects();
    var fgObjects = this.fgObjects();
    fgctx.clearRect(0,0,1024,576);
    for (var i = 0; i < fgObjects.length; i++ ) {
      fgObjects[i].draw(fgctx, this.camera);

      // COLLISION BOX DEBUG CODE:
      // if (allObjects[i] instanceof LW.Wizard) {
      //   allObjects[i].collBox.draw(ctx, this.camera, "white")
      // } else if (allObjects[i] instanceof LW.Spell) {
      //   allObjects[i].collBox.draw(ctx, this.camera, "red")
      // }
    }
    if (this.camera.hasMoved) {
      var bgObjects = this.bgObjects();
      this.camera.hasMoved = false;
      bgctx.clearRect(0,0,1024,576);
      this.background.draw(bgctx, this.camera);
      for (var i = 0; i < bgObjects.length; i++ ) {
        bgObjects[i].draw(bgctx, this.camera);
      }
    }
    for (var i = 0; i < this.wizards.length; i++) {
      var newPos = this.camera.relativePos(this.wizards[i].pos)
      fgctx.font = "15px Sans-serif"
      fgctx.strokeStyle = "black";
      fgctx.lineWidth = 3
      fgctx.strokeText(this.wizards[i].kills, newPos.x, newPos.y - 32);
      fgctx.fillStyle = "white";
      fgctx.fillText(this.wizards[i].kills, newPos.x, newPos.y - 32);
    }
  };

  Game.prototype.remove = function (obj) {
    if (obj instanceof LW.Spell) {
      var index = this.spells.indexOf(obj);
      if (index < 0) {
        return;
      }
      this.spells.splice(index, 1);
    } else if (obj instanceof LW.Particle) {
      var index = this.particles.indexOf(obj);
      if (index < 0) {
        return;
      }
      this.particles.splice(index, 1);
    }
  };

  Game.prototype.solidObjects = function () {
    return this.tiles;
  };

  Game.prototype.allObjects = function () {
    return this.tiles.concat(this.spawnPoints).concat(this.wizards).concat(this.spells).concat(this.particles);
  };

  Game.prototype.fgObjects = function () {
    return this.wizards.concat(this.spells).concat(this.particles);
  };

  Game.prototype.bgObjects = function () {
    return this.tiles.concat(this.spawnPoints);
  };

  Game.prototype.solidCollisions = function (collBox) {
    return this.allCollisions(collBox, this.solidObjects());
  };

  Game.prototype.spellCollisions = function (collBox) {
    return this.allCollisions(collBox, this.spells);
  };

  Game.prototype.wizardCollisions = function (collBox) {
    return this.allCollisions(collBox, this.wizards);
  };

  Game.prototype.allCollisions = function (collBox, objArray) {
    var collisions = [];
    for (var i = 0; i < objArray.length; i++) {
      if (collBox === objArray[i].collBox) {continue;}
      var collision = collBox.collision(objArray[i]);
      if (collision !== false) {
        collisions.push(collision);
      }
    }
    if (collisions.length === 0) {
      return false;
    } else {
      return collisions;
    }
  };

  Game.prototype.parseLevel = function (level) {
    for (var yIndex = 0; yIndex < Game.DIMY / 32; yIndex++ ) {
      for (var xIndex = 0; xIndex < Game.DIMX / 32; xIndex++) {
        if (level[yIndex][xIndex] === 1) {
          this.tiles.push(new LW.Tile({
            pos: [16 + xIndex * 32, 16 + yIndex * 32],
            img: "./graphics/box_stone.png"
          }));
        }
        if (level[yIndex][xIndex] === 2) {
          this.spawnPoints.push(new LW.Tile({
            pos: [16 + xIndex * 32, 16 + yIndex * 32],
            img: "./graphics/spawn_point.png"
          }));
        }
      }
    }
  };

  Game.prototype.getSpawnPointPos = function (wizard) {
    var randomSpawn = this.spawnPoints[Math.floor(Math.random()*this.spawnPoints.length)];
    var collisions = this.wizardCollisions(randomSpawn.collBox)
    while (collisions && collisions.indexOf(wizard) < 0 ) {
      randomSpawn = this.spawnPoints[Math.floor(Math.random()*this.spawnPoints.length)];
      collisions = this.wizardCollisions(randomSpawn.collBox)
    }
    return randomSpawn.pos;
  };


})();
