'use strict';
import Coord from '../utilities/coord';
import CollBox from '../utilities/collision_box';
import Sprite from './sprite';

function Tile(options) {
  this.pos = new Coord(options.pos);
  options.angle = options.angle || 0;
  options.dim = options.dim || this.dim;
  this.sprite = new Sprite({
    img: options.img != null ? options.img : this.img,
    parent: this,
    baseAngle: options.angle,
    sizeY: (this.sizeY || options.dim[1]) * (options.sizeYFactor || 6.25),
    sizeX: (this.sizeX || options.dim[0]) * (options.sizeXFactor || 6.25),
  });

  this.collBox = new CollBox(this, options.dim, options.angle);
  this.initialize(options);
}

Tile.extend = Util.fnExtend;

Tile.prototype.initialize = function () {};

Tile.prototype.dim = [16, 16];
Tile.prototype.sizeX = null;
Tile.prototype.sizeY = null;

Tile.prototype.draw = function (ctx, camera) {
  this.sprite.draw(ctx, camera);
};

Tile.prototype.getRect = function () {
  return this._rect || (this._rect = this.collBox.getRect());
};

export default Tile;
