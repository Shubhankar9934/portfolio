# 0014: Review every code change in the repo with a directory watcher

- Status: Accepted
- Date: 2026-11-03
- Phase: Tooling (developer workflow, not a product phase)
- Decided by: user (requested)

## Context
ADR-0012 reviews only files Claude edits with `Edit`/`Write`/`MultiEdit`. The user wants every code change reviewed, including changes made in an editor, by git, or by a script. Claude Code's `FileChanged` hook does cover outside changes, but its matcher takes literal filenames only, and its output cannot add context for Claude (checked against the hooks docs). So it cannot watch a whole directory or feed findings back to Claude.

## Decision
- **Watcher:** `.claude/hooks/review-watcher.mjs` uses Node's recursive `fs.watch` on the repo. It debounces each file for 1.5 s, then reviews it with the same read-only reviewer as ADR-0012, one review at a time.
- **Skipped paths:** `node_modules`, `dist`, `.git` and `.claude`, plus files that are not code extensions.
- **Start:** a `SessionStart` hook (`start-review-watcher.mjs`) launches the watcher detached when a Claude session begins. A lock file in the OS temp dir keeps only one watcher running.
- **Output:** findings go to `portfolio-review-watcher.log` in the OS temp dir, because a detached process has no terminal. Findings from the watcher do not appear in the Claude chat.
- **Claude edits:** the `PostToolUse` hook from ADR-0012 stays, so Claude still receives findings on its own edits as context.
- **No double reviews:** `review-lib.mjs` stores a content hash per reviewed file in the OS temp dir. The hook and the watcher skip any file whose content was already reviewed.
- **Permissions:** the reviewer keeps its read-only tools (`--tools Read,Glob,Grep`) with `--permission-mode dontAsk`. No broader permission is granted, and the reviewer cannot edit files.
- **Fail-open:** errors are logged and never block editing.
- The shared logic lives in `review-lib.mjs`. The `shell: true` option was removed from the spawn call, since `claude` is a native binary and shell mode depends on `cmd.exe`.

## Consequences
- Easier: every code change in the repo gets reviewed, whatever tool made it.
- Harder: findings from non-Claude edits are only in the log file. The watcher is a background process that the user can stop with Task Manager or by killing its PID in the lock file.
- Cost: every changed file costs one reviewer run. Hash caching avoids repeats for unchanged content.
- The watcher reviews only while a Claude session is open, since `SessionStart` starts it.

## Alternatives considered
- **`FileChanged` hook:** literal filenames only, and no context output. Rejected.
- **`bypassPermissions` for the reviewer:** not needed, since the reviewer is read-only and runs without prompts. Rejected as unnecessary risk.
- **Watcher started by the user manually:** simpler, but not automatic. Rejected in favour of the `SessionStart` hook.
- **Adding `Bash` to the `PostToolUse` matcher:** catches only Bash-driven edits, not editor saves or git. Rejected.
