/**
 * Created by Justin on 2016-03-03.
 */
'use strict';
import _ from 'lodash';
import React, { Component } from 'react';
import CommandsItemComponent from './CommandItem';

require('styles/menus/commands.scss');

class CategoriesComponent extends Component {
  render() {
    const index = this.props.index;
    const colIndex = this.props.colIndex;
    const categories = _.map(this.props.layer.categories, (category, column) => {
      return (
        <li>
          <h3 className="category-name">{category.name}</h3>
          <ul className="menu-commands">
            {_.map(category.commands, (command, i) => {
              return <CommandsItemComponent
                command={command}
                key={i}
                isSelected={column === colIndex && i === index}
              />;
            })}
          </ul>
        </li>
      );
    });

    return (
      <ul className="menu-categories">
        {categories}
      </ul>
    );
  }
}

export default CategoriesComponent;
