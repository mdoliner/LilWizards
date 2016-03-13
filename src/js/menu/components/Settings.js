/**
 * Created by Justin on 2016-03-04.
 */
'use strict';
import getLayer from '../get_layer';
import React, { Component } from 'react';
import CommandsComponent from './input/Commands';

class SettingsComponent extends Component {
  render() {
    const menu = this.props.menu;
    const layer = getLayer(menu.get('layerName'));

    return (
      <div className="main full">
        <h1 className="menu-title">Settings</h1>
        <CommandsComponent layer={layer} index={menu.get('index')} />
      </div>
    );
  }
}

export default SettingsComponent;

