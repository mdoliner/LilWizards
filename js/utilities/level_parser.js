/**
 * Created by Justin on 2015-10-06.
 */
(function() {

  LW.LevelParser = function(level) {
    level = _.cloneDeep(level);
    var objects = {
      tiles: [],
      spawnPoints: [],
      spikes: [],
      movingTiles: [],
    };

    var newX;
    var newY;
    var yIndex;
    var xIndex;
    var dim;
    var pos;
    var nextTile;

    for (yIndex = 0; yIndex < LW.Game.DIMY / 32; yIndex++) {
      for (xIndex = 0; xIndex < LW.Game.DIMX / 32; xIndex++) {
        if (level[yIndex][xIndex] === 'right') {
          newX = xIndex + 1;
          while (level[yIndex][newX] !== 'rightEnd') {
            newX += 1;
          }

          objects.tiles.push(new LW.Tile({
            pos: [16 + (xIndex + newX) * 16, 16 + yIndex * 32],
            dim: [(newX - xIndex) * 16 + 16, 16],
            img: './graphics/box_hard_stone.png',
            sizeXFactor: 6.25 / 2,
            sizeYFactor: 6.25 / 2,
            load: true,
          }));
        }

        if (level[yIndex][xIndex] === 'down') {
          newY = yIndex + 1;
          while (level[newY][xIndex] !== 'downEnd') {
            newY += 1;
          }

          objects.tiles.push(new LW.Tile({
            pos: [16 + xIndex * 32, 16 + (yIndex + newY) * 16],
            dim: [16, (newY - yIndex) * 16 + 16],
            img: './graphics/box_hard_stone.png',
            sizeXFactor: 6.25 / 2,
            sizeYFactor: 6.25 / 2,
            load: true,
          }));
        }

        if (level[yIndex][xIndex] === 1) {
          objects.tiles.push(new LW.Tile({
            pos: [16 + xIndex * 32, 16 + yIndex * 32],
            img: './graphics/box_hard_stone.png',
            sizeXFactor: 6.25 / 2,
            sizeYFactor: 6.25 / 2,
            load: true,
          }));
        }

        if (level[yIndex][xIndex] === 2) {
          objects.spawnPoints.push(new LW.Tile({
            pos: [16 + xIndex * 32, 16 + yIndex * 32],
            img: './graphics/spawn_point.png',
            load: true,
          }));
        }

        if (level[yIndex][xIndex] === 'spike') {
          objects.spikes.push(new LW.Objects.Spike({
            pos: [16 + xIndex * 32, 16 + yIndex * 32],
            load: true,
          }));
        }

        if (level[yIndex][xIndex] === 'horizontal') {
          pos = [16 + xIndex * 32, 16 + yIndex * 32];
          newX = xIndex + 1;
          dim = [16, 16];
          nextTile = level[yIndex][newX];

          while (nextTile != null && nextTile !== 'horizontalPath') {
            if (nextTile === 'horizontal') {
              dim = [(newX - xIndex) * 16 + 16, 16];
              pos = [16 + (xIndex + newX) * 16, 16 + yIndex * 32];
              level[yIndex][newX] = 0;
            }

            newX++;
            nextTile = level[yIndex][newX];
          }

          objects.movingTiles.push(new LW.Objects.MovingTile({
            pos: pos,
            dim: dim,
            load: true,
            vel: [1,0],
            moveTo: [32 + 32 * newX - dim[0], 16 + yIndex * 32],
          }));
        }

        if (level[yIndex][xIndex] === 'vertical') {
          pos = [16 + xIndex * 32, 16 + yIndex * 32];
          newY = yIndex + 1;
          dim = [16, 16];
          nextTile = level[newY][xIndex];

          while (nextTile != null && nextTile !== 'verticalPath') {
            if (nextTile === 'vertical') {
              dim = [16, (newY - yIndex) * 16 + 16];
              pos = [16 + xIndex * 32, 16 + (yIndex + newY) * 16];
              level[newY][xIndex] = 0;
            }

            newY++;
            nextTile = level[newY][xIndex];
          }

          objects.movingTiles.push(new LW.Objects.MovingTile({
            pos: pos,
            dim: dim,
            load: true,
            vel: [0,1],
            moveTo: [16 + xIndex * 32, 32 + 32 * newY - dim[1]],
          }));
        }
      }
    }

    return objects;
  };

})();
