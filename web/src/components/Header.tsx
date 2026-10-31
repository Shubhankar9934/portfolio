import { profile } from '../data/staticSource'
import { LinkedInIcon } from './LinkedInIcon'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <h1 className="brand">{profile.name}</h1>
          <p className="headline">{profile.headline}</p>
        </div>
        <nav aria-label="Primary" className="nav">
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href={`https://github.com/${profile.githubUser}`} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <LinkedInIcon />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
