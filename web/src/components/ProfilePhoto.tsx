import { profile } from '../data/staticSource'

/**
 * Circular profile photo. Shows a neutral silhouette until `photoUrl` is set in
 * `web/data/profile.json` (ADR-0013).
 */
export function ProfilePhoto() {
  // width/height match `.profile-photo` in index.css (72px); keep them in sync.
  // The photo sits beside the visible name, so alt is empty (decorative).
  if (profile.photoUrl) {
    return <img className="profile-photo" src={profile.photoUrl} alt="" width={72} height={72} />
  }
  return (
    <span className="profile-photo profile-photo--placeholder" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="12" cy="9" r="4" fill="currentColor" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor" />
      </svg>
    </span>
  )
}
