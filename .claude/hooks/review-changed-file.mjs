// PostToolUse hook: after Claude edits a code file, run the read-only
// code-reviewer subagent on that file and feed its findings back to Claude.
//
// Fails open: any error exits 0 with no output, so a broken review never
// blocks editing.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const REVIEWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html'])
const SKIPPED_SEGMENTS = ['node_modules', 'dist', '.claude']
const REVIEW_TIMEOUT_MS = 240_000

// Set on the nested `claude -p` call so its own edits don't start another review.
const GUARD_ENV = 'CLAUDE_CODE_REVIEW_HOOK'

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return null
  }
}

function shouldReview(absolutePath) {
  if (!REVIEWED_EXTENSIONS.has(path.extname(absolutePath))) return false
  const parts = absolutePath.split(path.sep)
  if (SKIPPED_SEGMENTS.some((segment) => parts.includes(segment))) return false
  return existsSync(absolutePath)
}

function runReview(projectDir, relativePath) {
  const prompt = `Review the changed file at ${relativePath} and report findings as specified in your instructions.`
  const result = spawnSync(
    'claude',
    [
      '-p',
      '--agent', 'code-reviewer',
      '--tools', 'Read,Glob,Grep',
      '--permission-mode', 'dontAsk',
      '--output-format', 'text',
    ],
    {
      cwd: projectDir,
      input: prompt,
      encoding: 'utf8',
      timeout: REVIEW_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      shell: true,
      env: { ...process.env, [GUARD_ENV]: '1' },
    },
  )

  if (result.error || result.status !== 0) {
    process.stderr.write(`code-review hook: review skipped (${result.error?.message ?? `exit ${result.status}`})\n`)
    return null
  }
  const output = result.stdout.trim()
  return output || null
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
  const review = runReview(projectDir, relativePath)
  if (!review) return

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `Automated code review of ${relativePath}:\n\n${review}`,
      },
    }),
  )
}

main()
