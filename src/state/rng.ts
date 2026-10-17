// Seeded RNG (mulberry32). ?seed=42 makes every chaos choice reproducible.
let s = (Date.now() ^ 0x9e3779b9) >>> 0;
export function seedRng(seed: number) { s = seed >>> 0; }
export function rng(): number {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export const rngInt = (n: number) => Math.floor(rng() * n);
export const pick = <T,>(a: readonly T[]): T => a[rngInt(a.length)];
