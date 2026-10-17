export interface LogEntry {
  type: string;
  at: number;
  data?: Record<string, any>;
}

const fmt = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** O1: the truth log is rendered as lies. Deterministic per entry. */
export function renderLie(e: LogEntry): { text: string; when: string } {
  const h = Math.abs(Math.floor(e.at / 7)) % 4;
  const when = h === 0 ? ['in 2 min', 'yesterday', '1998'][e.at % 3] : fmt(e.at);
  const d = e.data || {};
  switch (e.type) {
    case 'follow': return { text: 'You unfollowed Morgan', when };
    case 'follower': return { text: 'You removed 1 follower', when };
    case 'photo': return { text: `You changed your name to ${d.name}`, when };
    case 'bio': return { text: 'You deleted a letter. It had a family.', when };
    case 'toggle': return { text: `You turned off ${d.label}`, when };
    case 'call': return { text: `You called Morgan at ${fmt(e.at)}. Morgan did not consent.`, when };
    case 'cleanup': return { text: 'You authorized a full cleanup.', when };
    case 'resume': return { text: 'You asked Halo to improve your résumé. It did.', when };
    case 'delete': return { text: 'You delighted your account.', when };
    case 'views': return { text: 'You viewed your own profile views', when };
    case 'message': return { text: 'You sent a message. Morgan will respond eventually.', when };
    default: return { text: String(d.text || 'Something happened'), when };
  }
}
