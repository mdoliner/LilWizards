/**
 * Created by Justin on 2015-10-02.
 */
'use strict';
import Tile from '../base/tile';
import Wizard from '../base/wizard';

const Spike = Tile.extend({
  img: require('graphics/spike.png'),
  dim: [16, 12],
  onCollision: function (wizard) {
    if (!(wizard instanceof Wizard)) return;
    wizard.kill(wizard);
  },

  sizeX: 16,
  sizeY: 16,
});

export default Spike;
