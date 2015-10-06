/**
 * Created by Justin on 2015-10-05.
 */
(function() {
  if (window.LW == null) {
    window.LW = {};
  }

  LW.Objects.MovingTile = LW.Tile.extend({
    img: './graphics/box.png',
    initialize: function(options) {
      this.vel = LW.Coord(options.vel);
      this.startPoint = this.pos.dup();
      this.endPoint = options.moveTo;
      this.movingTo = 'endPoint';
    },

    step: function() {
      this.pos.add(this.vel);
    },

    reverse: function() {
      this.movingTo = this.movingTo === 'endPoint' ? 'startPoint' : 'endPoint';
      this.vel.times(-1);
    },
  });

})();
