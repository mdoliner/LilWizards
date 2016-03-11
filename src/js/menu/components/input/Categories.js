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
    const { index, colIndex, character, layer } = this.props;
    const categories = layer.display && character ? layer.display(character) : layer.categories;

    const categoryComponents = _.map(categories, (category, column) => {
      return (
        <li key={column}>
          <h3 className="category-name">{category.category}</h3>
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
        {categoryComponents}
      </ul>
    );
  }
}

export default CategoriesComponent;
