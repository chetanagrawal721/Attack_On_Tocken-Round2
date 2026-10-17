const q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
export const flags = {
  reset: q.get('reset') === '1',
  seed: q.get('seed') ? Number(q.get('seed')) : null,
  fast: q.get('fast') === '1', // compresses cinematics only (never Law 4)
  test: q.get('test') === '1',
  landing: q.get('landing') === '1',
  view: q.get('view'),
};
export const speed = (ms: number) => (flags.fast ? ms * 0.25 : ms);
