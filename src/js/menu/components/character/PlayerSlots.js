/**
 * Created by Justin on 2016-03-09.
 */
'use strict';
import getLayer from '../../get_layer';
import React, { Component } from 'react';
import CategoriesComponent from '../input/Categories';

class PlayerSlotsComponent extends Component {
  render() {
    const { character, menu } = this.props;
    const layer = getLayer(menu.get('layerName'));

    return (
      <div className="player-slots">
        <CategoriesComponent
          layer={layer}
          character={character}
          index={menu.get('index')}
          colIndex={menu.get('colIndex')}
        />
      </div>
    );
  }
}

export default PlayerSlotsComponent;
