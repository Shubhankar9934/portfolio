# 0011: Profile and project content sourcing

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: Claude (user to review)

## Context
The user had not supplied bio, skills, experience, education or project summaries.

## Decision
- Name, headline, location and company come from the user's public GitHub profile.
- Skills are derived from the languages and technologies visible in the user's public repos.
- Project summaries are drafted from each repo's README. `ASR_DIA_VAD`, `real_time_transcription` and `ANPR` have no README, so their summaries are short and inferred from the repo names; the user should confirm or rewrite them.
- Contact details found in repo READMEs (email, phone) are deliberately not published on the site.
- Experience and education are left empty; the page shows a dashed placeholder card pointing to `web/data/profile.json`. No fabricated history.
- `resumeUrl` is `null`, so the download button is hidden until a PDF is supplied (drop it in `web/public/` and set the URL, e.g. `/resume.pdf`).
- `sapienplus_folk_system` stays out of the featured list until the user decides.

## Consequences
- The site is publishable now without invented facts, but Experience/Education look empty until filled in.
- All content lives in `web/data/*.json`; no code changes needed to update it.
