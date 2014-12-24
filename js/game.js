(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Game = LW.Game = function () {
    this.wizards = [];
    this.wizards.push (new LW.Wizard({
      pos: [500,130],
      vel: [0,0],
      img: "./graphics/wiz.png",
      game: this
    }));
    this.wizards.push (new LW.Wizard({
      pos: [300,130],
      vel: [0,0],
      img: "./graphics/wiz.png",
      game: this
    }));
    this.tiles = [];
    this.parseLevel(Game.LEVEL);
  };

  Game.LEVEL = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                ]

  Game.DIMX = 1024;
  Game.DIMY = 576;

  Game.prototype.step = function () {
    this.wizards.forEach(function (wizard) {
      wizard.move();
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0,1024,576);
    var allObjects = this.allObjects();
    for (var i = 0; i < allObjects.length; i++ ) {
      allObjects[i].draw(ctx);
    }
  };

  Game.prototype.solidObjects = function () {
    return this.tiles;
  };

  Game.prototype.allObjects = function () {
    return this.tiles.concat(this.wizards);
  }

  Game.prototype.allCollisions = function (collBox) {
    var collisions = [];
    var solidObjects = this.solidObjects();
    for (var i = 0; i < solidObjects.length; i++) {
      var totalCollision = collBox.totalCollision(solidObjects[i].collBox);
      if (totalCollision !== false) {
        collisions.push(totalCollision);
      }
    }
    return collisions;
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
