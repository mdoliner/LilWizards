/**
 * Created by Justin on 2015-10-02.
 */
(function() {
  if (window.LW == null) {
    window.LW = {};
  }

  LW.Objects.Spike = LW.Tile.extend({
    img: 'graphics/spike.png',
    onWizardCollision: function(wizard) {
      wizard.kill(wizard);
    },
  });

})();
