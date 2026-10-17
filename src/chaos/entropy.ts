export type Stage = 'calm' | 'drift' | 'distrust' | 'possessed';

export const stageOf = (e: number): Stage => (e < 10 ? 'calm' : e < 30 ? 'drift' : e < 60 ? 'distrust' : 'possessed');

// Semantic drift (O7): label renames unlocked at entropy thresholds.
export const DRIFTS: { at: number; id: string; to: string }[] = [
  { at: 10, id: 'stat.followers', to: 'Witnesses' },
  { at: 20, id: 'btn.message', to: 'Plead' },
  { at: 30, id: 'tab.cases', to: 'Evidence' },
  { at: 60, id: 'tab.settings', to: 'Suggestions' },
];

export const VERIFIED_TIP: Record<Stage, string> = {
  calm: 'Verified',
  drift: 'Verified*  (*mostly)',
  distrust: 'Verification pending since 1998',
  possessed: 'Verified by Halo',
};
