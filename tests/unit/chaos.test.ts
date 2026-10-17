import { describe, expect, it } from 'vitest';
import { seedRng } from '../../src/state/rng';
import { mutateName } from '../../src/chaos/law1Photo';
import { chooseErosion, letterCount } from '../../src/chaos/law2Erosion';
import { pickOther } from '../../src/chaos/law5Settings';
import { stageOf } from '../../src/chaos/entropy';

describe('law1 mutateName', () => {
  it('always differs, non-empty, <= 28 chars', () => {
    seedRng(1);
    let n = 'Morgan Vale';
    for (let i = 0; i < 500; i++) {
      const next = mutateName(n);
      expect(next).not.toBe(n);
      expect(next.trim().length).toBeGreaterThan(0);
      expect(next.length).toBeLessThanOrEqual(28);
      n = next;
    }
  });
});

describe('law2 chooseErosion', () => {
  it('never picks short strings and prefers visible ones', () => {
    seedRng(2);
    for (let i = 0; i < 200; i++) {
      const hit = chooseErosion([
        { id: 'a', text: 'abc', visible: true },
        { id: 'b', text: 'Hello world', visible: true },
        { id: 'c', text: 'Hidden string', visible: false },
      ])!;
      expect(hit.id).toBe('b');
      expect(letterCount('Hello world')).toBe(10);
    }
  });
  it('falls back to non-visible when nothing is visible', () => {
    seedRng(3);
    expect(chooseErosion([{ id: 'c', text: 'Hidden string', visible: false }])!.id).toBe('c');
  });
});

describe('law5 pickOther', () => {
  it('never returns the clicked id and eventually returns every other id', () => {
    seedRng(4);
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'] as const;
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) {
      const o = pickOther(ids, 'c');
      expect(o).not.toBe('c');
      seen.add(o);
    }
    expect(seen.size).toBe(5);
  });
});

describe('entropy stages', () => {
  it('maps thresholds', () => {
    expect([0, 10, 30, 60].map(stageOf)).toEqual(['calm', 'drift', 'distrust', 'possessed']);
  });
});
