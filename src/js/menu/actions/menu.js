/**
 * Created by Justin on 2016-03-02.
 */
export function select(parameter) {
  return { type: 'SELECT', parameter };
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
