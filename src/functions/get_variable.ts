/**
 * Returns the value of the variable with the given name (starts at global window).
 * @param variable_name - The name of global variable to retrieve.
 * @returns value of the variable.
 */

export function get_variable(variable_name: string) {
  const moo = get(window, variable_name);
  console.log(moo);
  return moo;
}

// @ts-ignore
import get from 'lodash.get';
