// >>> WHERE TO PUT YOUR VIDEOS (all in public/media/, mp4 is tried first, the .webm placeholder second):
// >>>   Profile button on the landing page  -> public/media/galat-ghanta.mp4
// >>>   Get Started button on the landing   -> public/media/get-started.mp4
// >>>   Email button on the profile (call)  -> public/media/intrusion.mp4
export interface VideoEventConfig {
  sources: readonly { src: string; type: string }[];
  sound: 'always' | 'never' | 'respect-autoplay-setting';
  maxDurationMs: number;
  fallbackMs: number;
}

export const VIDEO_EVENTS = {
  incomingCall: {
    sources: [
      { src: '/media/intrusion.mp4', type: 'video/mp4' },
      { src: '/media/intrusion.webm', type: 'video/webm' },
    ],
    sound: 'always',            // Accept is a click, so the video plays with sound
    maxDurationMs: 600000,      // the video always plays to the end
    fallbackMs: 4000,
    ringtone: '/media/ringtone.mp3', // optional custom caller tone; a built-in phone ring is used if missing
  } as VideoEventConfig & { ringtone?: string },
  galatGhanta: {
    sources: [
      { src: '/media/galat-ghanta.mp4', type: 'video/mp4' },
      { src: '/media/galat-ghanta.webm', type: 'video/webm' },
    ],
    sound: 'always',
    maxDurationMs: 600000,
    fallbackMs: 4000,
  } as VideoEventConfig,
  getStarted: {
    sources: [
      { src: '/media/get-started.mp4', type: 'video/mp4' },
      { src: '/media/get-started.webm', type: 'video/webm' },
    ],
    sound: 'always',
    maxDurationMs: 600000,
    fallbackMs: 4000,
  } as VideoEventConfig,
};
