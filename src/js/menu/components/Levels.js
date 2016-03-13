/**
 * Created by Justin on 2016-03-11.
 */
'use strict';
import getLayer from '../get_layer';
import React, { Component } from 'react';
import CommandsComponent from './input/Commands';

class LevelsComponent extends Component {
  render() {
    const menu = this.props.menu;
    const layer = getLayer(menu.get('layerName'));

    return (
      <div className="menu-levels full">
        <h1 className="menu-title">Levels</h1>
        <CommandsComponent layer={layer} index={menu.get('index')} />
      </div>
    );
  }
}

export default LevelsComponent;
