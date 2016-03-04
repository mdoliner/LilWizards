/**
 * Created by Justin on 2016-03-03.
 */
'use strict';
import getLayer from '../get_layer';
import React, { Component } from 'react';
import CommandsComponent from './Commands';

class TopComponent extends Component {
  render() {
    const menu = this.props.menu;
    const layer = getLayer(menu.layer);

    return (
      <div className="main">
        <h1>Lil Wizards!</h1>
        <CommandsComponent layer={layer} index={menu.index} />
      </div>
    );
  }
}

export default TopComponent;

