/**
 * Created by Justin on 2016-03-03.
 */
'use strict';
import _ from 'lodash';
import React, { Component } from 'react';
import CommandsItemComponent from './CommandItem';

require('styles/menus/commands.scss');

class CommandsComponent extends Component {
  render() {
    const { index, layer } = this.props;
    const commands = layer.display && character ? layer.display(character) : layer.commands;
    const commandComps = _.map(commands, (command, i) => {
      return <CommandsItemComponent command={command} key={i} isSelected={i === index}/>;
    });

    return (
      <ul className="menu-commands">
        {commandComps}
      </ul>
    );
  }
}

export default CommandsComponent;
