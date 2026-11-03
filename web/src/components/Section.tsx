import type { ReactNode } from 'react'

// Shared page structure (ADR-0016): every content section has the same
// id, labelled heading, optional intro line, and body wrapper.
type SectionProps = {
  id: string
  title: string
  intro?: string
  children: ReactNode
}

export function Section({ id, title, intro, children }: SectionProps) {
  const titleId = `${id}-title`

  return (
    <section id={id} className="section" aria-labelledby={titleId}>
      <header className="section-header">
        <h2 id={titleId}>{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}
