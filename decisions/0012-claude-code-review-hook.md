# 0012: Automatic read-only code review after Claude edits a file

- Status: Accepted
- Date: 2026-10-31
- Phase: Tooling (developer workflow, not a product phase)
- Decided by: user (approved)

## Context
The user wants every file change reviewed automatically, with the review living in the repo's `.claude/` folder and following established review practice. Claude Code hooks can run a shell command on tool events. A hook cannot call a subagent directly, but it can run `claude -p --agent <name>` headlessly.

Claude Code also has a `FileChanged` event. Its matcher takes literal filenames, so it cannot watch every file in the repo.

## Decision
- **Trigger:** `PostToolUse` with matcher `Edit|Write|MultiEdit`, defined in `.claude/settings.json`. It fires after Claude itself changes a file.
- **Reviewer:** a project subagent at `.claude/agents/code-reviewer.md`. It has only `Read`, `Glob`, and `Grep` tools, so it reports findings and never edits. It checks correctness, security, React and TypeScript practice, accessibility, performance, and the project rules in `CLAUDE.md` and the ADRs.
- **Runner:** `.claude/hooks/review-changed-file.mjs` runs `claude -p --agent code-reviewer --tools "Read,Glob,Grep" --permission-mode dontAsk` on the changed file. The review prompt goes in on stdin, so the file path never reaches a shell argument. Findings come back to Claude as `additionalContext`.
- **Scope:** only `.ts .tsx .js .jsx .mjs .cjs .css .html` files that exist. Anything under `node_modules`, `dist`, or `.claude` is skipped.
- **Recursion guard:** the nested call sets `CLAUDE_CODE_REVIEW_HOOK=1`, and the hook exits at once when it sees that flag. This avoids `--bare`, which would need an API key.
- **Fail-open:** on timeout or error the hook writes a note to stderr and exits 0. A broken review never blocks editing.
- **Timeout:** 300 seconds for the hook, 240 seconds for the review.

## Consequences
- Easier: every Claude edit to code gets a second look, and the findings reach Claude while it can still act on them.
- Harder: each edit to a code file waits for a review, which adds time and API usage. The review is advisory. Claude decides whether to act on it, and nothing is blocked.
- Not covered: edits made in an editor outside Claude, or by `Bash`, do not trigger the hook. Covering them needs a file watcher outside Claude Code.
- Reviews rely on the reviewer's judgement, so they can miss issues or flag false positives. Treat findings as input, not verdicts.

## Alternatives considered
- **`FileChanged` hook:** exists, but its matcher takes literal filenames. It cannot cover every file without listing them.
- **Background file watcher (chokidar or similar):** catches editor saves too, but runs as a separate process the user must start and keep alive. Not chosen for this first version.
- **`claude -p --bare` for the nested call:** would prevent recursion by design, but requires `ANTHROPIC_API_KEY`, which this setup does not use. The env-var guard was chosen instead.
- **Blocking on findings (exit 2):** rejected because a review should advise, not stop work, and PostToolUse runs after the edit has already happened.
