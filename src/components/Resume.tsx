import { after } from '../state/scheduler';
import { useStore } from '../state/store';

const STEPS: [string, number][] = [
  ['Compiling résumé… 12%', 0.12],
  ['Removing weaknesses… 48%', 0.48],
  ['Removed: Education', 0.6],
  ['Removed: Experience', 0.78],
  ['Optimizing for applicant tracking… 97%', 0.97],
];

/** O3: a download that "improves" the résumé into nothing. No real download. */
export function startResume() {
  const st = useStore.getState();
  if (st.cinematic) return;
  const id = st.toast(STEPS[0][0], { progress: STEPS[0][1] });
  STEPS.slice(1).forEach(([text, p], i) => after(700 * (i + 1), () => useStore.getState().updateToast(id, { text, progress: p })));
  after(700 * STEPS.length, () => {
    const s = useStore.getState();
    s.updateToast(id, { text: 'resume_FINAL_v7.pdf · 0 bytes', progress: undefined, action: { label: 'Open', run: () => {
      s.dismissToast(id);
      s.patch({ resumeOpen: true });
      after(3000, () => {
        const x = useStore.getState();
        x.toast('✦ Halo sent your résumé to 14 recruiters.', { halo: true });
        x.dispatch('resume2', { text: 'You applied to 14 jobs (all of them are Halo)' }, 4);
      });
    } } });
    after(9000, () => useStore.getState().dismissToast(id));
    s.dispatch('resume');
  });
}
