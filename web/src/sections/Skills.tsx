import { profile } from '../data/staticSource'

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title">
      <h2 id="skills-title">Skills &amp; tech stack</h2>
      <div className="skills">
        {profile.skills.map((group) => (
          <div key={group.group}>
            <h3>{group.group}</h3>
            <ul className="tags">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
