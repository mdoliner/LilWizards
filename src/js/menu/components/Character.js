/**
 * Created by Justin on 2016-03-09.
 */
'use strict';
import getLayer from '../get_layer';
import _ from 'lodash';
import React, { Component } from 'react';

import PlayerCharacterComponent from './character/PlayerCharacter';
import PlayerSlotsComponent from './character/PlayerSlots';
import PlayerSpellsComponent from './character/PlayerSpells';
import PlayerReadyComponent from './character/PlayerReady';

const compMap = {
  playerCharacter: PlayerCharacterComponent,
  playerSlots: PlayerSlotsComponent,
  playerSpells: PlayerSpellsComponent,
  playerReady: PlayerReadyComponent,
};

class CharacterComponent extends Component {
  render() {
    const { menu, characters } = this.props;

    return (
      <div className="parent-menu full">
        {menu.get('subMenus').map((subMenu, key) => {
          const curr = subMenu.last();
          const Comp = compMap[curr.get('layerName')];
          return <Comp menu={curr} key={key} character={characters.get(key)}/>;
        }).toArray()}
      </div>
    );
  }
}

export default CharacterComponent;
