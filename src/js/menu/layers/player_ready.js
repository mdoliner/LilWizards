/**
 * Created by Justin on 2016-03-02.
 */
import { back, playerUnready } from '../actions/menu';

const playerCharacterMenu = {
  type: 'basic',
  commands: [
    { name: 'Unready', type: 'action' },
  ],

  action({ player }) {
    return (dispatch) => {
      dispatch(playerUnready({ player }));
      dispatch(back({ player }));
    };
  },
};

export default playerCharacterMenu;
