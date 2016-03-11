/**
 * Created by Justin on 2016-03-03.
 */
'use strict';
import React, { Component } from 'react';
import classNames from 'classnames';

require('styles/menus/command-item.scss');

class CommandItemComponent extends Component {
  render() {
    const { command, isSelected } = this.props;

    const className = classNames('menu-command-item', {
      disabled: command.disabled,
      'is-selected': isSelected,
    });

    return (
      <li className={className}>
        {command.name}
      </li>
    );
  }
}

export default CommandItemComponent;
