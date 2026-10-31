import { profile } from '../data/staticSource'
import { LinkedInIcon } from './LinkedInIcon'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
        <a href={`https://github.com/${profile.githubUser}`} target="_blank" rel="noreferrer">
          github.com/{profile.githubUser}
        </a>
        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="footer-linkedin">
          <LinkedInIcon />
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
