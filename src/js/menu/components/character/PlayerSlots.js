/**
 * Created by Justin on 2016-03-09.
 */
'use strict';
import getLayer from '../../get_layer';
import React, { Component } from 'react';

class PlayerSlotsComponent extends Component {
  render() {
    const menu = this.props.menu;

    return (
      <div className="player-slots">
        Player Slots
      </div>
    );
  }
}

export default PlayerSlotsComponent;
