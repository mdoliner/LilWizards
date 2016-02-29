/**
 * Created by Justin on 2016-02-29.
 */
const redux = require('redux');
const thunk = require('redux-thunk');
const reducers = require('../reducers');

module.exports = function (initialState) {
  const store = redux.createStore(
    reducers,
    redux.applyMiddleware(thunk),
    initialState
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};
