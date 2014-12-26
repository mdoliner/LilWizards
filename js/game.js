(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Game = LW.Game = function () {
    this.wizards = [];
    this.wizards.push (new LW.Wizard({
      pos: [500,130],
      vel: [0,0],
      facing: "right",
      img: "./graphics/wiz.png",
      game: this
    }));
    this.wizards.push (new LW.Wizard({
      pos: [300,130],
      vel: [0,0],
      facing: "left",
      img: "./graphics/wiz.png",
      game: this
    }));
    this.tiles = [];
    this.spells = [];
    this.parseLevel(Game.LEVEL);
  };

  Game.LEVEL = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
                [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
                [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1],
                [1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
                [1,0,0,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]

  Game.DIMX = 1024;
  Game.DIMY = 576;

  Game.prototype.step = function () {
    this.wizards.forEach(function (wizard) {
      wizard.move();
    });
    this.spells.forEach(function (spell) {
      spell.move();
    })
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0,1024,576);
    var allObjects = this.allObjects();
    for (var i = 0; i < allObjects.length; i++ ) {
      allObjects[i].draw(ctx);
    }
  };

  Game.prototype.remove = function (obj) {
    if (obj instanceof LW.Spell) {
      var index = this.spells.indexOf(obj);
      if (index < 0) {
        return;
      }
      this.spells.splice(index, 1);
    }
  };

  Game.prototype.solidObjects = function () {
    return this.tiles;
  };

  Game.prototype.allObjects = function () {
    return this.tiles.concat(this.wizards).concat(this.spells);
  }

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
            img: "./graphics/box.png"
          }));
        }
      }
    }
  };


})();
