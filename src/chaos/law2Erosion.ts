import { rngInt } from '../state/rng';

export const LETTER = /[A-Za-z]/;
export const letterCount = (s: string) => (s.match(/[A-Za-z]/g) || []).length;
export const isEligible = (s: string) => letterCount(s) > 3;

export interface Candidate {
  id: string;
  text: string;
  visible: boolean;
}

/** Uniform by letter across visible eligible strings (falls back to all eligible strings). */
export function chooseErosion(cands: Candidate[]): { id: string; index: number; char: string } | null {
  const elig = cands.filter((c) => isEligible(c.text));
  const vis = elig.filter((c) => c.visible);
  const pool = vis.length ? vis : elig;
  const slots: { id: string; index: number }[] = [];
  for (const c of pool) for (let i = 0; i < c.text.length; i++) if (LETTER.test(c.text[i])) slots.push({ id: c.id, index: i });
  if (!slots.length) return null;
  const s = slots[rngInt(slots.length)];
  const text = pool.find((c) => c.id === s.id)!.text;
  return { id: s.id, index: s.index, char: text[s.index] };
}

export const removeAt = (t: string, i: number) => t.slice(0, i) + t.slice(i + 1);
