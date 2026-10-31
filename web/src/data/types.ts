export interface RepoStats {
  stars: number
  language: string | null
  updatedAt: string
}

export interface Project {
  id: string
  repo: string
  title: string
  summary: string
  tags: string[]
  repoUrl: string
  demoUrl?: string
  stats?: RepoStats
}

export interface TimelineEntry {
  title: string
  organization: string
  period: string
  description?: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  company: string
  githubUser: string
  linkedinUrl: string
  resumeUrl: string | null
  skills: { group: string; items: string[] }[]
  experience: TimelineEntry[]
  education: TimelineEntry[]
}
