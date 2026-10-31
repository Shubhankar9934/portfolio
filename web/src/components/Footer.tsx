import { profile } from '../data/staticSource'

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
      </div>
    </footer>
  )
}
