/**
 * Created by Justin on 2016-03-02.
 */
export function select(parameter) {
  return { type: 'SELECT', parameter };
}

export function selectColumn(parameter) {
  return { type: 'SELECT_COLUMN', parameter };
}

export function confirm(parameter) {
  return { type: 'CONFIRM', parameter };
}

export function back(parameter) {
  return { type: 'BACK', parameter };
}

export function goTo(parameter) {
  return { type: 'GO_TO', parameter };
}

export function addChild(parameter) {
  return { type: 'ADD_CHILD', parameter };
}

export function removeChild(parameter) {
  return { type: 'REMOVE_CHILD', parameter };
}

export function playerReady(parameter) {
  return { type: 'PLAYER_READY', parameter };
}

export function playerUnready(parameter) {
  return { type: 'PLAYER_UNREADY', parameter };
}
