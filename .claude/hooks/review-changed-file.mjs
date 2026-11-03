// PostToolUse hook: after Claude edits a code file, run the read-only
// code-reviewer subagent on that file and feed its findings back to Claude.
// Also covers the directory watcher's cache, so a file is not reviewed twice.
//
// Fails open: any error exits 0 with no output, so a broken review never
// blocks editing.

import path from 'node:path'
import { GUARD_ENV, hashFile, isAlreadyReviewed, markReviewed, runReview, shouldReview } from './review-lib.mjs'
import { readFileSync } from 'node:fs'

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return null
  }
}

function main() {
  if (process.env[GUARD_ENV] === '1') return

  const input = readStdin()
  const filePath = input?.tool_input?.file_path
  if (typeof filePath !== 'string') return

  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd()
  const absolutePath = path.resolve(input.cwd ?? projectDir, filePath)
  if (!shouldReview(absolutePath)) return

  const relativePath = path.relative(projectDir, absolutePath).split(path.sep).join('/')
  const hash = hashFile(absolutePath)
  if (isAlreadyReviewed(relativePath, hash)) return

  const result = runReview(projectDir, relativePath)
  if (result.error) {
    process.stderr.write(`code-review hook: review skipped (${result.error})\n`)
    return
  }
  markReviewed(relativePath, hash)

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `Automated code review of ${relativePath}:\n\n${result.text}`,
      },
    }),
  )
}

main()
