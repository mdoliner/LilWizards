/**
 * Created by Justin on 2016-03-09.
 */
'use strict';
import getLayer from '../../get_layer';
import React, { Component } from 'react';
import CommandsComponent from '../input/Commands';

class PlayerReadyComponent extends Component {
  render() {
    const menu = this.props.menu;
    const layer = getLayer(menu.get('layerName'));

    return (
      <div className="player-character">
        You are readied up!
        <CommandsComponent layer={layer} index={menu.get('index')} />
      </div>
    );
  }
}

export default PlayerReadyComponent;
