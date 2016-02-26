/**
 * This file tests the rectangle class to make sure that collision is properly detected
 */
'use strict';
import Rectangle from '../../src/js/utilities/rectangle';
import Coord from '../../src/js/utilities/coord';

describe('Rectangle', function () {

  var createRect = function (x, y, width, height, angle) {
    return new Rectangle({ x: x, y: y, width: width, height: height, angle: (angle || 0)});
  };

  var rectString = function (rect) {
    return '{' + [rect.x, rect.y, rect.width, rect.height, rect.angle].join(',') +  '}'
  };

  var vecString = function (coord) {
    coord = new Coord(coord);
    return '(' + coord.x + ', ' + coord.y + ')'
  };

  var EPSILON = 1e-3;
  var checkCoords = function (coord, check) {
    check = new Coord(check);
    return Math.abs(coord.x - check.x) < EPSILON && Math.abs(coord.y - check.y) < EPSILON;
  };

  describe('#getAxis', function () {

    var rect;
    beforeEach(function () {
      rect = new Rectangle({ x: 5, y: 5, width: 10, height: 10, angle: 0 });
    });

    it('should correctly return the defaults if no rotation', function () {
      var axis = rect.getAxis();
      var checks = [new Coord([1, 0]), new Coord([0, 1])];
      for (var i = 0, n = axis.length; i < n; i++) {
        var ax = axis[i];
        var bool = checkCoords(ax, checks[0]) || checkCoords(ax, checks[1]);
        expect(bool, 'axis' + vecString(ax) + ' to be close to ' + vecString(checks[0]) + ' or ' + vecString(checks[1])).to.equal(true);
      }
    });

    it('should correctly return the proper axis if rotation', function () {
      rect.angle = 45;
      var axis = rect.getAxis();
      var checks = [new Coord([0.707106, 0.707106]), new Coord([-0.707106, 0.707106])];
      for (var i = 0, n = axis.length; i < n; i++) {
        var ax = axis[i];
        var bool = checkCoords(ax, checks[0]) || checkCoords(ax, checks[1]);
        expect(bool, 'axis' + vecString(ax) + ' to be close to ' + vecString(checks[0]) + ' or ' + vecString(checks[1])).to.equal(true);
      }
    });

  });

  describe('#corners', function () {

    var rect;
    beforeEach(function () {
      rect = new Rectangle({ x: 5, y: 5, width: 10, height: 10, angle: 0});
    });

    it('should correctly give the coordinates of a non-rotated rect', function () {
      var corners = rect.getCorners();
      expect(checkCoords(corners.TL, [5, 5]), 'corner' + vecString(corners.TL) + ' to be close to ' + vecString([5, 5])).to.equal(true);
      expect(checkCoords(corners.TR, [15, 5]), 'corner' + vecString(corners.TR) + ' to be close to ' + vecString([15, 5])).to.equal(true);
      expect(checkCoords(corners.BR, [15, 15]), 'corner' + vecString(corners.BR) + ' to be close to ' + vecString([15, 15])).to.equal(true);
      expect(checkCoords(corners.BL, [5, 15]), 'corner' + vecString(corners.BL) + ' to be close to ' + vecString([5, 15])).to.equal(true);
    });

    it('should correctly give the coordinates of a rotated rect', function () {
      rect.angle = 90;
      var corners = rect.getCorners();
      expect(checkCoords(corners.TL, [15, 5]), 'corner' + vecString(corners.TL) + ' to be close to ' + vecString([15, 5])).to.equal(true);
      expect(checkCoords(corners.TR, [15, 15]), 'corner' + vecString(corners.TR) + ' to be close to ' + vecString([15, 15])).to.equal(true);
      expect(checkCoords(corners.BR, [5, 15]), 'corner' + vecString(corners.BR) + ' to be close to ' + vecString([5, 15])).to.equal(true);
      expect(checkCoords(corners.BL, [5, 5]), 'corner' + vecString(corners.BL) + ' to be close to ' + vecString([5, 5])).to.equal(true);
    });

  });

  describe('#collision', function () {

    var rect;
    beforeEach(function () {
      rect = new Rectangle({ x: 5, y: 5, width: 10, height: 10, angle: 0});
    });

    it('should collide with something the matches its properties', function () {
      var rect2 = new Rectangle(rect);
      expect(!!rect.collision(rect2)).to.equal(true);
    });

    it('should collide with something that is inside of itself', function () {
      var rect2 = createRect(7, 7, 5, 5);
      expect(!!rect.collision(rect2)).to.equal(true);
    });

    it('should collide with something encompasing itself', function () {
      var rect2 = createRect(0, 0, 30, 30);
      expect(!!rect.collision(rect2)).to.equal(true);
    });

    it('should correctly determine that it is not colliding with something', function () {
      var rect2;
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;

          rect2 = createRect(i * 10 + 5, j * 10 + 5, 10, 10);
          expect(!!rect.collision(rect2), 'collsion of ' + rectString(rect) + ' vs ' + rectString(rect2)).to.equal(false);
        }
      }
    });

    it('should correctly determine that it is not colliding with something larger', function () {
      var rect2;
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;

          rect2 = createRect((-2 - i) * 10 + 5, (-2 - j) * 10 + 5, 10 * (i + 2), 10 * (j + 2));
          expect(!!rect.collision(rect2), 'collsion of ' + rectString(rect) + ' vs ' + rectString(rect2)).to.equal(false);
        }
      }
    });

    it('should correctly determine that it is not colliding with something that is rotated', function () {
      var rect2;
      for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;

          rect2 = createRect(i * 20, j * 20, 3, 3, 45);
          expect(!!rect.collision(rect2), 'collsion of ' + rectString(rect) + ' vs ' + rectString(rect2)).to.equal(false);
        }
      }
    });

  });

});
