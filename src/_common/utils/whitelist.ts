import { pickBy } from 'lodash';

export function whitelist<T extends Record<keyof unknown, unknown>>(obj: T): T {
  return pickBy(obj, (key) => key !== undefined) as T;
}
