import { profile } from '../data/staticSource'
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
