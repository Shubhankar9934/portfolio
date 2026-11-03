import { useEffect, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { Section } from '../components/Section'
import { createProjectsSource } from '../data/source'
import { profile } from '../data/staticSource'
import type { Project } from '../data/types'

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; projects: Project[] }

export function Projects() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let active = true
    createProjectsSource()
      .list()
      .then((projects) => active && setState({ status: 'ready', projects }))
      .catch(() => active && setState({ status: 'error' }))
    return () => {
      active = false
    }
  }, [])

  return (
    <Section id="projects" title="Featured projects">
      {state.status === 'loading' && <p className="muted">Loading projects…</p>}
      {state.status === 'error' && <p className="muted">Projects could not be loaded. Please try again later.</p>}
      {state.status === 'ready' && (
        <div className="grid">
          {state.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
      <p className="section-link">
        <a href={`https://github.com/${profile.githubUser}?tab=repositories`} target="_blank" rel="noreferrer">
          View all repositories on GitHub →
        </a>
      </p>
    </Section>
  )
}
