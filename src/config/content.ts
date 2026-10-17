// All profile copy. Every key here is an erodible text (Law 2) rendered through <Txt id=.../>.
export const PROFILE = {
  originalName: 'Morgan Vale',
  avatarJpg: '/media/avatar.jpg', // drop a jpg here to override the generated SVG avatar
  avatarSvg: '/media/avatar.svg',
};

export const DEFAULT_TEXTS: Record<string, string> = {
  headline: 'Principal Product Designer at Northwind',
  location: 'Lisbon, Portugal · Open to select projects',
  bio: 'Designing calm software for complicated businesses. Previously design lead at Northwind and Atlas. Speaker, mentor, occasional typographer.',
  about: 'I help teams turn tangled workflows into products people actually enjoy using. Fifteen years across fintech, logistics and health, with a bias for research, craft and shipping.',
  'tab.overview': 'Overview',
  'tab.cases': 'Case Studies',
  'tab.activity': 'Activity',
  'tab.settings': 'Settings',
  'stat.followers': 'Followers',
  'stat.following': 'Following',
  'stat.views': 'Profile views',
  'btn.message': 'Message',
  'btn.email': 'Email',
  'btn.resume': 'Résumé',
  'sec.bio': 'Bio',
  'sec.experience': 'Experience',
  'sec.featured': 'Featured work',
  'sec.about': 'About',
  'sec.skills': 'Skills',
  'sec.insights': 'Halo insights',
  'exp.1': 'Principal Product Designer · Northwind · 2021 – Present',
  'exp.2': 'Design Lead · Atlas Financial · 2017 – 2021',
  'exp.3': 'Senior Designer · Brightpath Health · 2013 – 2017',
  'skill.1': 'Product strategy',
  'skill.2': 'Design systems',
  'skill.3': 'User research',
  'skill.4': 'Prototyping',
  'skill.5': 'Typography',
  'skill.6': 'Mentoring',
  'insight.1': 'Profile strength: Excellent',
  'insight.2': 'Recruiters searching for you: 14 this week',
};

export const SKILL_IDS = ['skill.1', 'skill.2', 'skill.3', 'skill.4', 'skill.5', 'skill.6'];
export const EXP_IDS = ['exp.1', 'exp.2', 'exp.3'];

export const CASE_STUDIES = [
  ['Atlas Banking Redesign', 'Atlas Financial', 2021, '4.2 MB'],
  ['Northwind Fleet Console', 'Northwind', 2023, '6.8 MB'],
  ['Clinic Intake Flow', 'Brightpath Health', 2016, '2.1 MB'],
  ['Payments Design System', 'Atlas Financial', 2019, '9.4 MB'],
  ['Warehouse Pick Routes', 'Northwind', 2022, '3.3 MB'],
  ['Patient Portal v2', 'Brightpath Health', 2015, '5.0 MB'],
  ['Onboarding Rewrite', 'Lumen Labs', 2020, '1.9 MB'],
  ['Mobile Wallet', 'Atlas Financial', 2018, '7.7 MB'],
  ['Dispatch Dashboard', 'Northwind', 2024, '4.9 MB'],
  ['Accessibility Audit', 'Civic Works', 2019, '1.2 MB'],
  ['Type System Refresh', 'Northwind', 2022, '2.6 MB'],
  ['Insights Explorer', 'Lumen Labs', 2023, '3.8 MB'],
] as const;

export const SETTING_DEFS = [
  { id: 'darkMode', label: 'Dark mode', desc: 'Use a darker theme across your profile.' },
  { id: 'emailNotifications', label: 'Email notifications', desc: 'Get a digest when people view or follow you.' },
  { id: 'onlineStatus', label: 'Show online status', desc: 'Let visitors see when you are active.' },
  { id: 'twoFactor', label: 'Two-factor authentication', desc: 'Require a second step when signing in.' },
  { id: 'autoplay', label: 'Autoplay video with sound', desc: 'Play embedded video with audio on.' },
  { id: 'haloAgent', label: 'Let Halo act on my behalf', desc: 'Allow Halo to optimize your profile automatically.' },
] as const;
export type SettingId = (typeof SETTING_DEFS)[number]['id'];
export const SETTING_IDS = SETTING_DEFS.map((s) => s.id) as SettingId[];

export const SEED_LOG = [
  { type: 'seed', text: 'Halo improved your headline for engagement', ago: '2 days ago' },
  { type: 'seed', text: 'You were mentioned in a case study', ago: '5 days ago' },
  { type: 'seed', text: 'Profile strength reached Excellent', ago: '1 week ago' },
];

for (const [i, c] of CASE_STUDIES.entries()) DEFAULT_TEXTS[`cs.f${i}`] = c[0];
