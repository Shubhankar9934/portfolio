// Shared logic for the code-review hooks (ADR-0014).
// Used by review-changed-file.mjs (PostToolUse) and review-watcher.mjs (directory watcher).

import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const REVIEWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.html'])
export const SKIPPED_SEGMENTS = ['node_modules', 'dist', '.git', '.claude']
const REVIEW_TIMEOUT_MS = 240_000

// Set on the nested `claude -p` call so its own edits don't start another review.
export const GUARD_ENV = 'CLAUDE_CODE_REVIEW_HOOK'

// Hashes of files already reviewed, so the same content is never reviewed twice.
// Kept in the OS temp dir (not the repo) so no project folder is created.
const CACHE_FILE = path.join(os.tmpdir(), 'portfolio-review-cache.json')

export function isInsideSkippedDir(absolutePath) {
  const parts = absolutePath.split(path.sep)
  return SKIPPED_SEGMENTS.some((segment) => parts.includes(segment))
}

export function shouldReview(absolutePath) {
  if (!REVIEWED_EXTENSIONS.has(path.extname(absolutePath))) return false
  if (isInsideSkippedDir(absolutePath)) return false
  return existsSync(absolutePath)
}

export function hashFile(absolutePath) {
  return createHash('sha256').update(readFileSync(absolutePath)).digest('hex')
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

export function isAlreadyReviewed(relativePath, hash) {
  return loadCache()[relativePath] === hash
}

export function markReviewed(relativePath, hash) {
  const cache = loadCache()
  cache[relativePath] = hash
  try {
    writeFileSync(CACHE_FILE, JSON.stringify(cache))
  } catch {
    // Cache is an optimisation only; a failed write just means a possible repeat review.
  }
}

export function runReview(projectDir, relativePath) {
  const prompt = `Review the changed file at ${relativePath} and report findings as specified in your instructions.`
  // No shell: `claude` is a native executable, and shell mode depends on cmd.exe being available.
  const result = spawnSync(
    process.env.CLAUDE_CODE_EXECPATH || 'claude',
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
      env: { ...process.env, [GUARD_ENV]: '1' },
    },
  )

  if (result.error || result.status !== 0) {
    return { error: result.error?.message ?? `exit ${result.status}` }
  }
  const output = result.stdout.trim()
  return output ? { text: output } : { error: 'empty review output' }
}
