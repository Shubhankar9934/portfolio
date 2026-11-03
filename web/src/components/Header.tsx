import { profile } from '../data/staticSource'
import { LinkedInIcon } from './LinkedInIcon'
import { ProfilePhoto } from './ProfilePhoto'
import { ThemeToggle } from './ThemeToggle'
import { XIcon } from './XIcon'

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="identity">
          <ProfilePhoto />
          <div>
            <h1 className="brand">{profile.name}</h1>
            <p className="headline">{profile.headline}</p>
          </div>
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
          {profile.twitterUrl && (
            <a href={profile.twitterUrl} target="_blank" rel="noreferrer" aria-label="X (Twitter)" title="X (Twitter)">
              <XIcon />
            </a>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
