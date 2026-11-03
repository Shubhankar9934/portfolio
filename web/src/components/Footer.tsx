import { profile } from '../data/staticSource'

// GitHub and LinkedIn links live in the header (ADR-0015), so the footer only carries the copyright.
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
      </div>
    </footer>
  )
}
