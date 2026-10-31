# 0005: Phase 1 sections

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: user

## Context
The user chose which sections the first release contains.

## Decision
Phase 1 includes: Projects showcase, Skills / Tech stack, Experience / Education with a downloadable resume. A full Hero and About section was not selected. Claude added only a slim header/footer (name, GitHub link, theme toggle) so the page has navigation and identity; this is an assumption the user can reverse.

## Consequences
- Experience and skills content is needed from the user (`profile.json`, `resume.pdf`); placeholders are used until supplied.
- A Hero/About section can be added later without structural change.

## Alternatives considered
- Adding a full Hero + About: not selected by the user.
