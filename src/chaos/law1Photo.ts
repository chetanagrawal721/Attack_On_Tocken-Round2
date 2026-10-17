import { pick, rngInt } from '../state/rng';

const LOOK: Record<string, string> = { a: '4', e: '3', o: '0', l: '1', s: '5' };
const SURNAMES = ['Kale', 'Veil', 'Vael', 'Valley', 'Vail'];
const SUFFIX = ['™', '®', ' Jr.', ' PhD', ', MBA'];

const swapAdj = (n: string) => {
  const i = rngInt(n.length - 1);
  return n.slice(0, i) + n[i + 1] + n[i] + n.slice(i + 2);
};
const dup = (n: string) => {
  const i = rngInt(n.length);
  return n.slice(0, i + 1) + n[i] + n.slice(i + 1);
};
const lookalike = (n: string) => {
  const idx = [...n].map((c, i) => (LOOK[c.toLowerCase()] ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return n;
  const i = pick(idx);
  return n.slice(0, i) + LOOK[n[i].toLowerCase()] + n.slice(i + 1);
};
const rhyme = (n: string) => {
  const [f, ...r] = n.split(' ');
  return r.length ? `${f} ${pick(SURNAMES)}` : n;
};
const suffix = (n: string) => n + pick(SUFFIX);
const oddCaps = (n: string) => {
  const i = 1 + rngInt(Math.max(1, n.length - 2));
  return n.slice(0, i) + n[i].toUpperCase() + n.slice(i + 1);
};

const MUTATORS = [swapAdj, dup, lookalike, rhyme, suffix, oddCaps];

/** Always returns a name that differs from `current`, is non-empty and <= 28 chars. */
export function mutateName(current: string): string {
  for (let t = 0; t < 40; t++) {
    const next = pick(MUTATORS)(current);
    if (next && next !== current && next.length <= 28 && next.trim().length > 0) return next;
  }
  const base = current.length > 24 ? current.slice(0, 24) : current;
  return base.slice(0, -1) + (base.endsWith('x') ? 'z' : 'x');
}
