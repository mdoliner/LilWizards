/**
 * Created by Justin on 2016-03-09.
 */
'use strict';
import getLayer from '../../get_layer';
import React, { Component } from 'react';
import CommandsComponent from '../input/Commands';

class PlayerCharacterComponent extends Component {
  render() {
    const menu = this.props.menu;
    const layer = getLayer(menu.get('layerName'));

    return (
      <div className="player-character">
        Player Character
        <CommandsComponent layer={layer} index={menu.get('index')} />
      </div>
    );
  }
}

export default PlayerCharacterComponent;
