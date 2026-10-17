import { useStore } from '../state/store';

/** Erodible text (Law 2). Renders as a single text node so glyph rects can be measured. */
export function Txt({ id }: { id: string }) {
  const t = useStore((s) => s.override[id] ?? s.texts[id]);
  return <span data-txt={id}>{t}</span>;
}

export const Icon = {
  camera: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
  ),
  pencil: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
  ),
  chat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l2.6 2 3.3-.2 1.2 3 2.9 1.6-.6 3.2 1.4 3-2.5 2.2-.5 3.2-3.2.7L12 22.5l-2.6-2-3.3.2-1.2-3-2.9-1.6.6-3.2L1.2 9.9l2.5-2.2.5-3.2 3.2-.7z" /><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  silhouette: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--muted)"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" /></svg>
  ),
};
