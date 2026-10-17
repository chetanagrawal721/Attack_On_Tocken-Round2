import { rngInt } from '../state/rng';

/** Returns a setting id different from the clicked one. */
export function pickOther<T extends string>(ids: readonly T[], clicked: T): T {
  const others = ids.filter((i) => i !== clicked);
  return others[rngInt(others.length)];
}
