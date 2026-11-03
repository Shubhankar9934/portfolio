import { Section } from '../components/Section'
import { profile } from '../data/staticSource'

export function Skills() {
  return (
    <Section id="skills" title="Skills &amp; tech stack">
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
    </Section>
  )
}
