import { profile } from '../data/staticSource'
import type { TimelineEntry } from '../data/types'

function Timeline({ title, entries }: { title: string; entries: TimelineEntry[] }) {
  return (
    <div>
      <h3>{title}</h3>
      {entries.length === 0 ? (
        <p className="placeholder">Not added yet. Fill in {title.toLowerCase()} in web/data/profile.json.</p>
      ) : (
        <ol className="timeline">
          {entries.map((entry) => (
            <li key={`${entry.organization}-${entry.period}`}>
              <p className="timeline-period">{entry.period}</p>
              <p className="timeline-title">
                {entry.title} · {entry.organization}
              </p>
              {entry.description && <p className="muted">{entry.description}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title">Experience &amp; education</h2>
      <div className="two-col">
        <Timeline title="Experience" entries={profile.experience} />
        <Timeline title="Education" entries={profile.education} />
      </div>
      {profile.resumeUrl && (
        <p className="section-link">
          <a className="button" href={profile.resumeUrl} download>
            Download resume (PDF)
          </a>
        </p>
      )}
    </section>
  )
}
