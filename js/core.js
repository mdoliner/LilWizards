function requireAll(r) {
  r.keys().forEach(r);
}

window._ = require('./vendor/lodash');
requireAll(require.context('./utilities', true, /\.js$/));
requireAll(require.context('./vendor', true, /\.js$/));
requireAll(require.context('./base', true, /\.js$/));
requireAll(require.context('./spell_list', true, /\.js$/));
requireAll(require.context('./objects', true, /\.js$/));
require('./menu/main-menu');
require('./menu/main-quad');
requireAll(require.context('./menu', true, /\.js$/));
requireAll(require.context('./game', true, /\.js$/));
require('./on-load');
