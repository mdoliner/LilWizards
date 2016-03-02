/**
 * Created by Justin on 2016-02-29.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import Menus from './containers/Menus';
import $ from 'jquery';

const store = configureStore();
export default store;

$(() => {
  render(
    <Provider store={store}>
      <Menus />
    </Provider>,
    document.getElementById('menu')
  );
});
