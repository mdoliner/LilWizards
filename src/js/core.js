require('../styles/game.scss');
require('../styles/instructions.scss');

require('./vendor/gamepad');
require('./vendor/keymaster');
require('./on-load');

function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('./spell_list', true, /\.js$/));

window.Immutable = require('immutable');
