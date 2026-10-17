// Central cancellable scheduler. Chaos never runs from mount effects.
const live = new Set<number>();
export function after(ms: number, fn: () => void): () => void {
  const id = window.setTimeout(() => { live.delete(id); fn(); }, ms);
  live.add(id);
  return () => { window.clearTimeout(id); live.delete(id); };
}
export function cancelAll() { live.forEach((id) => window.clearTimeout(id)); live.clear(); }
export interface Step { at: number; run: () => void }
export function runTimeline(steps: Step[], scale = 1): () => void {
  const cancels = steps.map((st) => after(st.at * scale, st.run));
  return () => cancels.forEach((c) => c());
}
