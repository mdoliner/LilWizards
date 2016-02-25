/**
 * Created by Justin on 2015-10-05.
 */
'use strict';
import Tile from '../base/tile';
import Coord from '../utilities/coord';
import Wizard from '../base/wizard';

const MovingTile = Tile.extend({
  img: require('graphics/box.png'),
  initialize: function (options) {
    this.vel = new Coord(options.vel);
    this.startPoint = this.pos.dup();
    this.endPoint = new Coord(options.moveTo);
    this.movingTo = 'endPoint';
  },

  step: function () {
    this.pos.plus(this.vel);
    var point = this[this.movingTo];
    if (this.pos.x === point.x && this.pos.y === point.y) {
      this.reverse();
    }
  },

  reverse: function () {
    this.movingTo = this.movingTo === 'endPoint' ? 'startPoint' : 'endPoint';
    this.vel.times(-1);
  },

  getRect: function () {
    return this.collBox.getRect();
  },

  onCollision: function (wizard) {
    if (!(wizard instanceof Wizard)) return;

    wizard.pos.plus(this.vel);
    // var dir = this.vel.x === 0 ? 'y' : 'x';
    // var vel = this.vel;
    // var killSelf = function () { wizard.kill(wizard) };
    // wizard.once('after:move', function () {
    //   wizard.collBox.removeCollision(dir, 0, {
    //     leftCollision: vel.x < 0 ? killSelf : null,
    //     rightCollision: vel.x > 0 ? killSelf : null,
    //     bottomCollision: vel.y > 0 ? killSelf : null,
    //     topCollision: vel.y < 0 ? killSelf : null,
    //   });
    // })
  },

});

export default MovingTile;
