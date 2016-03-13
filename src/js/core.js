require('../styles/game.scss');

require('./vendor/gamepad');
require('./vendor/keymaster');
require('./on-load');

const spellListContext = require.context('./spell_list', true, /\.js$/);
spellListContext.keys().forEach(spellListContext);

window.Immutable = require('immutable');
