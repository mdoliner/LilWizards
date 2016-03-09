/**
 * Created by Justin on 2016-02-29.
 */
'use strict';
import _ from 'lodash';
import React, { Component } from 'react';
import TopComponent from './Top';
import SettingsComponent from './Settings';

class Main extends Component {
  render() {
    const menu = this.props.menu.last();
    const menuProps = {
      menu: menu,
    };

    let menuToRender;
    if (menu.get('layerName') === 'top') {
      menuToRender = <TopComponent {...menuProps} />;
    } else if (menu.get('layerName') === 'settings') {
      menuToRender = <SettingsComponent {...menuProps} />;
    }

    return (
      <div className="main">
        {menuToRender}
      </div>
    );
  }
}

export default Main;
