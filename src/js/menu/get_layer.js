/**
 * Created by Justin on 2016-03-02.
 */
let layers = require('./layers');

if (module.hot) {
  module.hot.accept('./layers', () => {
    layers = require('./layers');
  });
}

export default function getLayer(name) {
  return layers[name];
}
