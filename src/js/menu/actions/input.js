/**
 * Created by Justin on 2016-03-02.
 */
export const ACTION_NAME = 'INPUT';

export default function inputAction(parameter) {
  return { type: ACTION_NAME, parameter };
}
