import projectsJson from '../../data/projects.json'
import statsJson from '../../data/github-stats.json'
import profileJson from '../../data/profile.json'
import type { Profile, Project, RepoStats } from './types'

export const profile: Profile = profileJson

const stats: Record<string, RepoStats> = statsJson

const projects: Project[] = projectsJson.map((p) => ({
  ...p,
  repoUrl: `https://github.com/${profile.githubUser}/${p.repo}`,
  stats: stats[p.repo],
}))

export const staticProjectsSource = {
  list: async (): Promise<Project[]> => projects,
}
