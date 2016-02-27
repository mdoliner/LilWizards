/**
 * Created by Justin on 2015-10-06.
 */
'use strict';
import { DIMY, DIMX } from '../game/game';

const MAX_OBJECTS = 10;
const MAX_LEVELS = 5;

function createBounds(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
  };
}

/**
 * Defining QuadTree quads as:
 *   2 3
 *   1 0
  */

function QuadTree(level, bounds) {
  this.level = level || 1;
  this.bounds = bounds || { x: 0, y: 0, width: DIMX, height: DIMY };
  this.nodes = [];
  this.objects = [];
}

QuadTree.prototype.clear = function () {
  this.objects = [];

  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i] != null) {
      this.nodes[i].clear();
      this.nodes[i] = null;
    }
  }
};

QuadTree.prototype.split = function () {
  var x = this.bounds.x;
  var y = this.bounds.y;
  var width = this.bounds.width / 2;
  var height = this.bounds.height / 2;
  var level = this.level + 1;

  this.nodes[0] = new QuadTree(level, createBounds(x + width, y + height, width, height));
  this.nodes[1] = new QuadTree(level, createBounds(x, y + height, width, height));
  this.nodes[2] = new QuadTree(level, createBounds(x, y, width, height));
  this.nodes[3] = new QuadTree(level, createBounds(x + width, y, width, height));
};

QuadTree.prototype.getIndex = function (rect) {
  var index = -1;
  var verMid = this.bounds.x + this.bounds.width / 2;
  var horMid = this.bounds.y + this.bounds.height / 2;

  var isTopQuad = (rect.y < horMid && rect.y + rect.height < horMid);
  var isBotQuad = (rect.y > horMid);

  if (rect.x < verMid && rect.x + rect.width < verMid) {
    if (isTopQuad) {
      index = 2;
    } else if (isBotQuad) {
      index = 1;
    }
  } else if (rect.x > verMid) {
    if (isTopQuad) {
      index = 3;
    } else if (isBotQuad) {
      index = 0;
    }
  }

  return index;
};

QuadTree.prototype.insert = function (rect) {
  var index;
  if (this.nodes[0] != null) {
    index = this.getIndex(rect);

    if (index != -1) {
      this.nodes[index].insert(rect);

      return;
    }
  }

  this.objects.push(rect);

  if (this.objects.length > MAX_OBJECTS && this.level < MAX_LEVELS) {
    if (this.nodes[0] == null) {
      this.split();
    }

    var i = 0;
    while (i < this.objects.length) {
      index = this.getIndex(this.objects[i]);
      if (index !== -1) {
        this.nodes[index].insert(this.objects.splice(i, 1)[0]);
      } else {
        i++;
      }
    }
  }
};

QuadTree.prototype.retrieve = function (rect) {
  var index = this.getIndex(rect);
  var objects = this.objects;

  if (index !== -1 && this.nodes[0] != null) {
    objects = this.nodes[index].retrieve(rect).concat(objects);
  } else if (index === -1 && this.nodes[0] != null) {
    for (let i = 0; i < 4; i++) {
      objects = this.nodes[i].retrieve(rect).concat(objects);
    }
  }

  return objects;
};

export default QuadTree;
