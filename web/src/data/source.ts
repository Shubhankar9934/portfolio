import { staticProjectsSource } from './staticSource'
import type { Project } from './types'

/**
 * The only way UI code reads projects. Phase 1 reads curated JSON; Phase 2 adds an
 * API-backed implementation selected with VITE_DATA_SOURCE=api (see decisions/0002).
 */
export interface ProjectsSource {
  list(): Promise<Project[]>
}

export function createProjectsSource(): ProjectsSource {
  const kind = import.meta.env.VITE_DATA_SOURCE ?? 'static'
  if (kind === 'static') return staticProjectsSource
  throw new Error(`Unsupported VITE_DATA_SOURCE "${kind}"`)
}
