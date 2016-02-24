/**
 * Created by Justin on 2015-10-02.
 */
(function() {
  if (window.LW == null) {
    window.LW = {};
  }

  LW.Objects.Spike = LW.Tile.extend({
    img: require('graphics/spike.png'),
    dim: [16, 12],
    onCollision: function(wizard) {
      if (!(wizard instanceof LW.Wizard)) return;
      wizard.kill(wizard);
    },

    sizeX: 16,
    sizeY: 16,
  });

})();
