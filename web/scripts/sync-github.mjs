// Enriches the curated projects with live stats from the GitHub API at build time.
// Writes data/github-stats.json. Never fails the build: on any error the previous file is kept.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dataDir = new URL('../data/', import.meta.url)
const projects = JSON.parse(await readFile(new URL('projects.json', dataDir), 'utf8'))
const profile = JSON.parse(await readFile(new URL('profile.json', dataDir), 'utf8'))
const statsFile = new URL('github-stats.json', dataDir)

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

let previous = {}
try {
  previous = JSON.parse(await readFile(statsFile, 'utf8'))
} catch {
  // First run: nothing to merge with.
}

const next = { ...previous }
let updated = 0

for (const { repo } of projects) {
  try {
    const res = await fetch(`https://api.github.com/repos/${profile.githubUser}/${repo}`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    next[repo] = { stars: data.stargazers_count, language: data.language, updatedAt: data.pushed_at }
    updated++
  } catch (err) {
    console.warn(`sync-github: ${repo} skipped (${err.message})`)
  }
}

if (updated > 0) {
  await writeFile(statsFile, JSON.stringify(next, null, 2) + '\n')
}
console.log(`sync-github: updated ${updated}/${projects.length} repos -> ${fileURLToPath(statsFile)}`)
