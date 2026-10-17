import { useStore } from '../state/store';

/** Cleanup beat: the same content as unstyled default-browser HTML. */
export function RawProfile() {
  const s = useStore();
  return (
    <div className="raw" data-testid="raw-profile">
      <h1>{s.profile.displayName}</h1>
      <p>{s.texts.headline}</p>
      <p>{s.texts.location}</p>
      <p><a href="#">Follow</a> | <a href="#">Message</a> | <a href="#">Email</a> | <a href="#">Résumé</a></p>
      <hr />
      <h2>{s.texts['sec.bio']}</h2>
      <p>{s.texts.bio}</p>
      <h2>{s.texts['sec.experience']}</h2>
      <ul><li>{s.texts['exp.1']}</li><li>{s.texts['exp.2']}</li><li>{s.texts['exp.3']}</li></ul>
      <h2>{s.texts['sec.skills']}</h2>
      <ul>{[1, 2, 3, 4, 5, 6].map((i) => <li key={i}>{s.texts[`skill.${i}`]}</li>)}</ul>
    </div>
  );
}
