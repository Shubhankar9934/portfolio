import type { Project } from '../data/types'

export function ProjectCard({ project }: { project: Project }) {
  const { stats } = project

  return (
    <article className="card">
      <h3>{project.title}</h3>
      <p className="card-summary">{project.summary}</p>
      <ul className="tags" aria-label="Technologies">
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <div className="card-footer">
        <span className="meta">
          {stats ? `${stats.language ?? 'n/a'} · ★ ${stats.stars}` : ' '}
        </span>
        <span className="links">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Demo
            </a>
          )}
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            Code
          </a>
        </span>
      </div>
    </article>
  )
}
