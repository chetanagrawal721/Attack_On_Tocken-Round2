export interface FinaleInput {
  originalName: string;
  displayName: string;
  nameChanges: number;
  saves: number;
  erosions: { char: string }[];
  followers: number;
  startFollowers: number;
  lost: number;
  forcedSetting: boolean;
  unsent: number;
  activeMs: number;
  videoSeen: boolean;
}

export const mmss = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function diffLines(i: FinaleInput): { sign: '-' | '+'; text: string }[] {
  const out: { sign: '-' | '+'; text: string }[] = [];
  out.push({ sign: '-', text: `name: ${i.originalName}` }, { sign: '+', text: `name: ${i.displayName}` });
  out.push(
    { sign: '-', text: `followers: ${i.startFollowers.toLocaleString('en-US')}` },
    { sign: '+', text: `followers: ${i.followers.toLocaleString('en-US')}` },
  );
  if (i.erosions.length) out.push({ sign: '-', text: `letters: ${i.erosions.map((e) => e.char).join(' ')}` });
  if (i.lost) out.push({ sign: '-', text: `files: ${i.lost} case study permanently removed` });
  if (i.forcedSetting) out.push({ sign: '+', text: 'setting: Let Halo act on my behalf = on' });
  if (i.unsent) out.push({ sign: '-', text: `messages: ${i.unsent} unsent` });
  if (i.videoSeen) out.push({ sign: '+', text: 'call: 1 video call (you declined; it connected anyway)' });
  return out;
}

export function visitorBio(i: FinaleInput): string {
  const n = i.nameChanges;
  return `Renamed Morgan ${n} time${n === 1 ? '' : 's'}. Saved ${i.saves} edit${i.saves === 1 ? '' : 's'}. Cost Morgan ${Math.max(0, i.startFollowers - i.followers)} followers.${i.videoSeen ? ' Declined one call (it connected anyway).' : ''}`;
}
