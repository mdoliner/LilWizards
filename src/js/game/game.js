/**
 * Core Game object. Handles the state of the game.
 */
'use strict';
import _ from 'lodash';
import Camera from './camera';
import Coord from '../utilities/coord';
import CollBox from '../utilities/collision_box';
import SpellList from '../base/spell_list';
import Sprite from '../base/sprite';
import Spell from '../base/spell';
import ParticleLibrary from '../base/particle_library';
import Particle from '../base/particle';
import ParticleSplatter from '../utilities/particle_splatter';
import LevelParser from '../utilities/level_parser';
import Ailment from '../base/ailment';
import QuadTree from '../utilities/quad_tree';
import Settings from '../settings/settings';
import { GlobalSL } from '../utilities/sound_library';

function Game(options) {
  this.wizards = [];
  this.tiles = [];
  this.spawnPoints = [];
  this.spikes = [];
  this.movingTiles = [];
  this.spells = [];
  this.spellRemoveQueue = [];
  this.solidQuadTree = new QuadTree();
  this.spellQuadTree = new QuadTree();
  this.wizardQuadTree = new QuadTree();
  this.bounds = {};
  this.parseLevel(options.level);
  this.particles = new ParticleLibrary;
  this.camera = new Camera({
    pos: [512,288],
    size: 100,
  });
  this.audio = GlobalSL;
  this.background = new Sprite({
    pos: [512,288],
    img: options.background,
    background: true,
    load: true,
    game: this,
  });
  this.drawAll = true;
}

Game.DIMX = 1024;
Game.DIMY = 576;
Game.MAX_ZOOM = 125;
Game.LEVEL_PADDING = 200;

Game.prototype.step = function () {
  if (false && this.camera.move.time <= 0) {
    this.adjustCamera();
  }

  this.clearTrees();
  this.buildTrees();
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

Game.prototype.playSE = function (src, volume) {
  volume = volume || 0.8;
  this.audio.playSE(src, volume);
};

Game.prototype.adjustCamera = function () {
  var arrX = [];
  var arrY = [];
  this.wizards.forEach(function (wizard) {
    arrX.push(wizard.pos.x);
    arrY.push(wizard.pos.y);
  }.bind(this));

  arrX = arrX.sort((function (a,b) {return a - b; }));

  arrY = arrY.sort((function (a,b) {return a - b; }));

  var avgX = (arrX[0] + arrX[arrX.length - 1]) / 2;
  var avgY = (arrY[0] + arrY[arrY.length - 1]) / 2;
  var magX = Game.DIMX / (Math.abs(avgX - arrX[arrX.length - 1]) * 3) * 100;
  var magY = Game.DIMY / (Math.abs(avgY - arrY[arrY.length - 1]) * 3) * 100;
  var mag = Math.min(magX, magY, Game.MAX_ZOOM);
  this.camera.moveTo({
    endPos: [avgX, avgY],
    endSize: mag,
    moveType: 'linear',
    duration: 10,
  });
};

Game.prototype.draw = function (fgctx, bgctx) {
  //var allObjects = this.allObjects();
  var fgObjects = this.fgObjects();
  var i;

  fgctx.clearRect(0, 0, 1024, 576);
  for (i = 0; i < fgObjects.length; i++) {
    fgObjects[i].draw(fgctx, this.camera);

    // COLLISION BOX DEBUG CODE:
    // if (allObjects[i] instanceof Wizard) {
    //   allObjects[i].collBox.draw(ctx, this.camera, "white")
    // } else if (allObjects[i] instanceof Spell) {
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

Game.prototype.remove = function (obj) {
  if (obj instanceof Spell) {
    this.spellRemoveQueue.push(obj);
  } else if (obj instanceof Particle) {
    var index = this.particles.indexOf(obj);
    if (index < 0) {
      return;
    }

    this.particles.spliceOne(index);
  }
};

Game.prototype.emptyRemoveQueue = function () {
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

Game.prototype.solidObjects = function () {
  return this.tiles.concat(this.spikes).concat(this.movingTiles);
};

Game.prototype.allObjects = function () {
  return this.tiles.concat(this.spawnPoints).concat(this.wizards).concat(this.spells);
};

Game.prototype.fgObjects = function () {
  return this.wizards.concat(this.spells).concat(this.particles).concat(this.movingTiles);
};

Game.prototype.bgObjects = function () {
  return this.tiles.concat(this.spikes).concat(this.spawnPoints);
};

Game.prototype.clearTrees = function () {
  this.solidQuadTree.clear();
  this.spellQuadTree.clear();
  this.wizardQuadTree.clear();
};

Game.prototype.buildTrees = function () {
  var i;
  var solidObjects = this.solidObjects();
  for (i = 0; i < solidObjects.length; i++) {
    this.solidQuadTree.insert(solidObjects[i].getRect());
  }

  for (i = 0; i < this.spells.length; i++) {
    this.spellQuadTree.insert(this.spells[i].getRect());
  }

  for (i = 0; i < this.wizards.length; i++) {
    if (this.wizards[i].isDead()) continue;
    this.wizardQuadTree.insert(this.wizards[i].getRect());
  }
};

Game.prototype.solidCollisions = function (collBox) {
  return this.quadCollisions(collBox, this.solidQuadTree);
};

Game.prototype.spellCollisions = function (collBox) {
  return this.quadCollisions(collBox, this.spellQuadTree);
};

Game.prototype.wizardCollisions = function (collBox) {
  return this.quadCollisions(collBox, this.wizardQuadTree);
};

// Deprecated --
Game.prototype.solidCollisionsDeprecated = function (collBox) {
  return this.allCollisions(collBox, this.solidObjects());
};

Game.prototype.spellCollisionsDeprecated = function (collBox) {
  return this.allCollisions(collBox, this.spells);
};

Game.prototype.wizardCollisionsDeprecated = function (collBox) {
  return this.allCollisions(collBox, _.filter(this.wizards, function (wizard) {
    return !wizard.isDead();
  }));
};

Game.prototype.allCollisions = function (collBox, objArray) {
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
}
// --<< Deprecated

Game.prototype.quadCollisions = function (collBox, quadTree) {
  var collisions = [];
  var rect = collBox.getRect();
  var objects = quadTree.retrieve(rect);
  for (var i = 0; i < objects.length; i++) {
    var grandParent = objects[i].parent.parent;
    if (collBox.parent === grandParent) continue;

    var collision = rect.collision(objects[i]);
    if (collision !== false) {
      collisions.push(grandParent);
      if (grandParent.onCollision) grandParent.onCollision(collBox.parent);
    }
  }

  if (collisions.length) {
    return collisions;
  } else {
    return false;
  }
};

Game.prototype.parseLevel = function (level) {
  var objects = LevelParser(level);
  this.tiles = objects.tiles;
  this.spawnPoints = objects.spawnPoints;
  this.movingTiles = objects.movingTiles;
  this.spikes = objects.spikes;
  this.bounds = {
    x: -Game.LEVEL_PADDING,
    y: -Game.LEVEL_PADDING,
    width: level[0].length * 32 + Game.LEVEL_PADDING,
    height: level.length * 32 + Game.LEVEL_PADDING
  };
};

Game.prototype.getSpawnPointPos = function (wizard) {
  var tries = 1;
  var randomIdx = Math.floor(Math.random() * this.spawnPoints.length);
  var randomSpawn = this.spawnPoints[randomIdx];
  var collisions = this.wizardCollisionsDeprecated(randomSpawn.collBox);
  while (collisions && tries <= this.spawnPoints.length) {
    tries++;
    randomIdx = (randomIdx + 1) % this.spawnPoints.length;
    randomSpawn = this.spawnPoints[randomIdx];
    collisions = this.wizardCollisionsDeprecated(randomSpawn.collBox);
  }

  return randomSpawn.pos;
};

Game.prototype.isOver = function () {
  if (this.gameEnding) {return;}

  for (var i = 0; i < this.wizards.length; i++) {
    if (this.wizards[i].kills >= Settings.WinKills) {
      this.endGame(this.wizards[i]);
      return true;
    }
  }

  return false;
};

Game.prototype.endGame = function (winner) {
  this.gameEnding = true;
  this.playSE('applause.ogg', 100);
  this.audio.$bgm.animate({ volume: 0 }, 4000);
  var victoryFollow = setInterval(function () {
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
  setTimeout(function () {
    this.gameEnded = true;
    clearInterval(victoryFollow);
  }.bind(this), 5000);
};

var ParticleTest = function () {
  var randVel = new Coord([Math.random() / 4, 0]).plusAngleDeg(Math.random() * 360);
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
    tickEvent: function () {
      this.color.hue += 3;
    },
  };
};

export default Game;
export const DIMX = Game.DIMX;
export const DIMY = Game.DIMY;
