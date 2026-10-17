// >>> WHERE TO PUT YOUR SOUNDS (all in public/media/). If a file is missing, a built-in synthesized
// >>> sound plays instead, so there is always audio.
// >>>   faq-alert.mp3      alert music: starts when FAQ is clicked, loops through the attack
// >>>   gunshot.mp3        gunfire: plays when the gun fires after you press Yes
// >>>   profile-alert.mp3  plays on the landing page when Profile is clicked; the red alert lasts exactly as long as this file
// >>>   plane_crash.mp3    plane crash after the call ends; its loudest moment is synced to the explosion
// >>>   ringtone.mp3       caller tone for the Email call on the profile (see videoEvents.ts)
export const SOUNDS = {
  faqAlert: { src: '/media/faq-alert.mp3', loop: true, volume: 0.75, synth: 'siren' },
  gunshot: { src: '/media/gunshot.mp3', loop: false, volume: 1, synth: 'gunshot' },
  profileAlert: { src: '/media/profile-alert.mp3', loop: false, volume: 0.85, synth: 'siren' },
  planeCrash: { src: '/media/plane_crash.mp3', loop: false, volume: 1, synth: 'gunshot' },
} as const;

export type SoundName = keyof typeof SOUNDS;
