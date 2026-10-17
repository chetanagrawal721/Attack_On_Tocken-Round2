import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CASE_STUDIES, DEFAULT_TEXTS, PROFILE, SETTING_DEFS, SETTING_IDS, type SettingId } from '../config/content';
import { DRIFTS, stageOf } from '../chaos/entropy';
import { mutateName } from '../chaos/law1Photo';
import { pickOther } from '../chaos/law5Settings';
import { removeAt } from '../chaos/law2Erosion';
import type { LogEntry } from '../chaos/activityLies';
import { after } from './scheduler';
import { flags, speed } from './flags';
import { rng } from './rng';

export type FollowPhase = 'follow' | 'following' | 'unfollowed' | 'followed_successfully';
export type TabId = 'overview' | 'cases' | 'activity' | 'settings';
export type Cinematic = null | 'call' | 'cleanup' | 'finale' | 'incident';
export interface Toast { id: number; text: string; halo?: boolean; progress?: number; action?: { label: string; run: () => void } }
export interface Msg { from: 'me' | 'morgan'; text: string; unsent?: boolean }

export interface Persisted {
  version: 1;
  identity: 'morgan' | 'visitor';
  profile: { displayName: string; originalName: string };
  texts: Record<string, string>;
  erosions: { textId: string; char: string; index: number; at: number }[];
  followers: number;
  followPhase: FollowPhase;
  settings: Record<SettingId, boolean>;
  entropy: number;
  log: LogEntry[];
  files: { id: string; title: string; client: string; year: number; size: string; lost: boolean }[];
  messages: Msg[];
  flags: { videoSeen: boolean; attackSeen: boolean; finaleSeen: boolean; messageStage: 0 | 1 | 2 | 3; viewsChecked: number; forcedHalo: boolean; bannerShown: boolean; drifted: string[]; interrupted?: boolean; phantom?: boolean };
  visit: { firstAt: number; visits: number; activeMs: number; nameChanges: number; saves: number; followerLosses: number };
}

interface Ephemeral {
  tab: TabId;
  cinematic: Cinematic;
  toasts: Toast[];
  unstyled: boolean;
  gravity: boolean;
  blackout: boolean;
  photoBusy: boolean;
  bioOpen: boolean;
  highlightHalo: boolean;
  avatarGone: boolean;
  messageOpen: boolean;
  resumeOpen: boolean;
  finaleOpen: boolean;
  view: 'landing' | 'profile';
  photoFx: number;
  photoClip: 'off' | 'poof' | 'play' | 'done';
  photoClipKey: number;
  callBlocked: boolean;
  override: Record<string, string>;
  nameOverride: string | null;
  rearranged: boolean;
  unread: boolean;
  settingsOrder: string[];
  syncBanner: boolean;
  toggleCount: number;
  typing: boolean;
  glyphs: { id: number; char: string; x: number; y: number }[];
}

const START_FOLLOWERS = 1248;
function initialView(): 'landing' | 'profile' {
  try {
    if (flags.view === 'profile' || (flags.test && !flags.landing)) return 'profile';
    if (sessionStorage.getItem('halo:view') === 'profile') return 'profile';
  } catch { /* ignore */ }
  return 'landing';
}
const LAW_EVENTS = ['photo', 'bio', 'toggle', 'follower', 'follow'];

const initial = (): Persisted => ({
  version: 1,
  identity: 'morgan',
  profile: { displayName: PROFILE.originalName, originalName: PROFILE.originalName },
  texts: { ...DEFAULT_TEXTS },
  erosions: [],
  followers: START_FOLLOWERS,
  followPhase: 'follow',
  settings: { darkMode: false, emailNotifications: true, onlineStatus: true, twoFactor: true, autoplay: false, haloAgent: false },
  entropy: 0,
  log: [],
  files: CASE_STUDIES.map(([title, client, year, size], i) => ({ id: `f${i}`, title, client, year, size, lost: false })),
  messages: [],
  flags: { videoSeen: false, attackSeen: false, finaleSeen: false, messageStage: 0, viewsChecked: 0, forcedHalo: false, bannerShown: false, drifted: [] },
  visit: { firstAt: Date.now(), visits: 1, activeMs: 0, nameChanges: 0, saves: 0, followerLosses: 0 },
});

export interface Actions {
  applyDrift: () => void;
  dispatch: (type: string, data?: Record<string, any>, entropy?: number) => void;
  toast: (text: string, opts?: Partial<Toast>) => number;
  updateToast: (id: number, patch: Partial<Toast>) => void;
  dismissToast: (id: number) => void;
  setTab: (t: TabId) => void;
  userTab: (t: TabId) => void;
  setView: (v: 'landing' | 'profile') => void;
  phantomNotify: () => void;
  changePhoto: () => void;
  saveBio: (text: string, erode: (s: Persisted['texts']) => { id: string; index: number; char: string } | null) => void;
  loseFollower: () => void;
  followClick: () => void;
  resumeFollow: () => void;
  toggleSetting: (id: SettingId) => void;
  setCinematic: (c: Cinematic) => void;
  patch: (p: Partial<Persisted & Ephemeral>) => void;
  resetAll: () => void;
}

export type State = Persisted & Ephemeral & Actions;
let toastId = 1;
let followCancel: (() => void) | null = null;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      tab: 'overview',
      cinematic: null,
      toasts: [],
      unstyled: false,
      gravity: false,
      blackout: false,
      photoBusy: false,
      bioOpen: false,
      highlightHalo: false,
      avatarGone: false,
      messageOpen: false,
      resumeOpen: false,
      finaleOpen: false,
      view: initialView(),
      photoFx: 0,
      photoClip: 'off',
      photoClipKey: 0,
      callBlocked: false,
      override: {},
      nameOverride: null,
      rearranged: false,
      unread: false,
      settingsOrder: [...SETTING_IDS],
      syncBanner: false,
      toggleCount: 0,
      typing: false,
      glyphs: [],

      dispatch: (type, data, entropy = 5) => {
        const s = get();
        set({ entropy: s.entropy + entropy, log: [{ type, at: Date.now(), data }, ...s.log].slice(0, 80) });
        // Law events never trigger label drift, so law verification stays clean; drift lands on other actions.
        if (!LAW_EVENTS.includes(type)) get().applyDrift();
        const st = get();
        if (!st.flags.bannerShown && (st.entropy >= 60 || (st.flags.videoSeen && st.flags.attackSeen))) {
          set({ flags: { ...st.flags, bannerShown: true } });
        }
      },
      applyDrift: () => {
        const s = get();
        const texts = { ...s.texts };
        const done = [...s.flags.drifted];
        for (const d of DRIFTS) if (s.entropy >= d.at && !done.includes(d.id)) { texts[d.id] = d.to; done.push(d.id); }
        if (done.length !== s.flags.drifted.length) set({ texts, flags: { ...s.flags, drifted: done } });
      },

      toast: (text, opts = {}) => {
        const id = toastId++;
        set((s) => ({ toasts: [...s.toasts, { id, text, ...opts }].slice(-4) }));
        if (opts.progress === undefined) after(3200, () => get().dismissToast(id));
        return id;
      },
      updateToast: (id, patch) => set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      setTab: (tab) => {
        set({ tab });
        get().applyDrift();
        try { history.replaceState(null, '', `#${tab}`); } catch { /* ignore */ }
      },

      userTab: (t) => {
        const s = get();
        const prev = s.tab;
        // Interrupted transition: the first visit to Case Studies starts, then bounces back.
        if (t === 'cases' && !s.flags.interrupted && !s.cinematic) {
          set({ tab: t, flags: { ...s.flags, interrupted: true } });
          after(speed(650), () => {
            if (get().tab === 'cases') {
              get().setTab(prev);
              get().toast('✦ Halo thought you meant to stay here.', { halo: true });
            }
          });
          return;
        }
        get().setTab(t);
        if (t === 'activity' && !s.flags.phantom) after(speed(900), () => get().phantomNotify());
      },
      setView: (v) => {
        set({ view: v });
        try { if (v === 'profile') sessionStorage.setItem('halo:view', 'profile'); else sessionStorage.removeItem('halo:view'); } catch { /* ignore */ }
      },
      phantomNotify: () => {
        const s = get();
        if (s.flags.phantom || s.cinematic) return;
        set({ flags: { ...s.flags, phantom: true }, unread: true });
        get().toast('✦ Morgan accepted your connection request.', { halo: true, action: { label: 'View', run: () => get().setTab('activity') } });
        get().dispatch('phantom', { text: 'Morgan accepted your connection request' }, 2);
      },

      // LAW 1: never touches the photo. Mutates the display name.
      changePhoto: () => {
        if (get().photoBusy) return;
        // the profile picture pops out of existence and the clip plays in its place (the <img> itself is never changed)
        set({ photoBusy: true, photoFx: get().photoFx + 1, photoClip: 'poof', photoClipKey: get().photoClipKey + 1 });
        after(300, () => { if (get().photoClip === 'poof') set({ photoClip: 'play' }); });
        after(500, () => {
          const s = get();
          const name = mutateName(s.profile.displayName);
          set({ photoBusy: false, profile: { ...s.profile, displayName: name }, visit: { ...s.visit, nameChanges: s.visit.nameChanges + 1 } });
          get().toast('Photo updated ✓');
          get().dispatch('photo', { name }, 3);
        });
      },

      // LAW 2 (save half): store typed bio, then permanently erode one letter.
      saveBio: (text, erode) => {
        set((s) => ({ texts: { ...s.texts, bio: text }, visit: { ...s.visit, saves: s.visit.saves + 1 } }));
        const hit = erode(get().texts);
        if (hit) {
          set((s) => ({
            texts: { ...s.texts, [hit.id]: removeAt(s.texts[hit.id], hit.index) },
            erosions: [...s.erosions, { textId: hit.id, char: hit.char, index: hit.index, at: Date.now() }],
          }));
        }
        get().toast('Bio saved.');
        get().dispatch('bio', undefined, 3);
      },

      // LAW 3
      loseFollower: () => {
        const s = get();
        if (s.followers <= 0) return;
        set({ followers: s.followers - 1, visit: { ...s.visit, followerLosses: s.visit.followerLosses + 1 } });
        get().dispatch('follower', undefined, 1);
      },

      // LAW 4 (button style never depends on phase)
      followClick: () => {
        const p = get().followPhase;
        if (p === 'follow') {
          set({ followPhase: 'following' });
          get().resumeFollow();
          get().dispatch('follow', undefined, 3);
        } else if (p === 'unfollowed') {
          set({ followPhase: 'followed_successfully' });
        }
      },
      resumeFollow: () => {
        if (followCancel) followCancel();
        followCancel = after(2000, () => {
          if (get().followPhase === 'following') set({ followPhase: 'unfollowed' });
        });
      },

      // LAW 5: the clicked toggle never changes; a different one flips.
      toggleSetting: (id) => {
        const other = pickOther(SETTING_IDS, id);
        const s = get();
        const next = !s.settings[other];
        set({ settings: { ...s.settings, [other]: next } });
        get().toast('Settings saved ✓');
        if (other === 'twoFactor' && !next) get().toast('✦ Two-factor authentication disabled. Halo will keep you safe.', { halo: true });
        const label = SETTING_DEFS.find((d) => d.id === other)!.label;
        const n = get().toggleCount + 1;
        set({ toggleCount: n });
        if (n % 3 === 0) {
          const o = [...get().settingsOrder];
          for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
          set({ settingsOrder: o, syncBanner: true });
          after(2500, () => set({ syncBanner: false }));
        }
        get().dispatch('toggle', { label }, 3);
      },

      setCinematic: (c) => set({ cinematic: c }),
      patch: (p) => set(p as any),
      resetAll: () => {
        if (followCancel) followCancel();
        set({ ...initial(), tab: 'overview', cinematic: null, toasts: [], unstyled: false, gravity: false, blackout: false, photoBusy: false, bioOpen: false, highlightHalo: false, avatarGone: false, messageOpen: false, resumeOpen: false, finaleOpen: false, photoClip: 'off', callBlocked: false, override: {}, nameOverride: null, rearranged: false, unread: false, settingsOrder: [...SETTING_IDS], syncBanner: false, toggleCount: 0, typing: false, glyphs: [] });
      },
    }),
    {
      name: 'halo:v1',
      version: 1,
      storage: createJSONStorage(() => {
        try { localStorage.getItem('x'); return localStorage; } catch { return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as any; }
      }),
      partialize: (s) => {
        const o: any = {};
        for (const k of ['version', 'identity', 'profile', 'texts', 'erosions', 'followers', 'followPhase', 'settings', 'entropy', 'log', 'files', 'messages', 'flags', 'visit']) o[k] = (s as any)[k];
        return o;
      },
      merge: (persisted: any, current) => {
        try {
          if (!persisted || persisted.version !== 1) return current;
          return { ...current, ...persisted, texts: { ...current.texts, ...persisted.texts }, settings: { ...current.settings, ...persisted.settings } };
        } catch { return current; }
      },
    },
  ),
);

export const stage = () => stageOf(useStore.getState().entropy);
export { START_FOLLOWERS };
export const visibleFiles = (s: Persisted) => s.files.filter((f) => !f.lost);

/** Called once on boot (not a chaos trigger): visit counting, reset, test hook. */
export function bootStore() {
  if (flags.reset) {
    try { localStorage.removeItem('halo:v1'); } catch { /* ignore */ }
    useStore.getState().resetAll();
    try {
      const u = new URLSearchParams(location.search);
      u.delete('reset'); // keep the other flags (test/seed/landing) so a reload behaves the same
      history.replaceState(null, '', location.pathname + (u.toString() ? `?${u}` : '') + location.hash);
    } catch { /* ignore */ }
  } else {
    const s = useStore.getState();
    useStore.setState({ visit: { ...s.visit, visits: s.visit.visits + 1 } });
    if (s.followPhase === 'following') s.resumeFollow(); // L4.4 idempotent resume
  }
  if (flags.test) (window as any).__halo = { get: () => useStore.getState(), set: (p: any) => useStore.setState(p), reset: () => useStore.getState().resetAll() };
}
