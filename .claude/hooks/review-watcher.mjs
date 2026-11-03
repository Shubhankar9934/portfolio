// Directory watcher: reviews any code file that changes anywhere in the repo,
// whether Claude, an editor, git, or a script changed it (ADR-0014).
//
// Runs as a background process started by start-review-watcher.mjs. Only one
// instance runs at a time (lock file in the OS temp dir). Output goes to the log
// file named below, since a detached process has no terminal.
//
// Run it in the foreground to watch output live:  node .claude/hooks/review-watcher.mjs

import { appendFileSync, existsSync, readFileSync, unlinkSync, writeFileSync, watch } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashFile, isAlreadyReviewed, isInsideSkippedDir, markReviewed, runReview, shouldReview } from './review-lib.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const projectDir = process.env.CLAUDE_PROJECT_DIR ?? path.resolve(here, '..', '..')
const LOCK_FILE = path.join(os.tmpdir(), 'portfolio-review-watcher.pid')
const LOG_FILE = path.join(os.tmpdir(), 'portfolio-review-watcher.log')
const DEBOUNCE_MS = 1500

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`
  process.stdout.write(line)
  try {
    appendFileSync(LOG_FILE, line)
  } catch {
    // Logging must never stop the watcher.
  }
}

function isAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

function acquireLock() {
  if (existsSync(LOCK_FILE)) {
    const pid = Number(readFileSync(LOCK_FILE, 'utf8'))
    if (pid && pid !== process.pid && isAlive(pid)) return false
  }
  writeFileSync(LOCK_FILE, String(process.pid))
  return true
}

function releaseLock() {
  try {
    if (readFileSync(LOCK_FILE, 'utf8') === String(process.pid)) unlinkSync(LOCK_FILE)
  } catch {
    // Lock already gone.
  }
}

// Reviews run one at a time so a burst of saves does not start many claude processes.
let queue = Promise.resolve()
const timers = new Map()

function reviewFile(relativePath) {
  const absolutePath = path.join(projectDir, relativePath)
  if (!shouldReview(absolutePath)) return
  const hash = hashFile(absolutePath)
  if (isAlreadyReviewed(relativePath, hash)) return

  log(`reviewing ${relativePath}`)
  const result = runReview(projectDir, relativePath)
  if (result.error) {
    log(`review skipped for ${relativePath}: ${result.error}`)
    return
  }
  markReviewed(relativePath, hash)
  log(`review of ${relativePath}:\n${result.text}\n`)
}

function schedule(relativePath) {
  clearTimeout(timers.get(relativePath))
  timers.set(
    relativePath,
    setTimeout(() => {
      timers.delete(relativePath)
      queue = queue.then(() => reviewFile(relativePath)).catch((error) => log(`watcher error: ${error.message}`))
    }, DEBOUNCE_MS),
  )
}

function main() {
  if (!acquireLock()) {
    log('another review watcher is already running; exiting')
    return
  }
  process.on('exit', releaseLock)
  process.on('SIGINT', () => process.exit(0))
  process.on('SIGTERM', () => process.exit(0))

  log(`watching ${projectDir} (log: ${LOG_FILE})`)
  watch(projectDir, { recursive: true }, (_event, filename) => {
    if (!filename) return
    const relativePath = String(filename).split(path.sep).join('/')
    if (isInsideSkippedDir(path.join(projectDir, relativePath))) return
    schedule(relativePath)
  })
}

main()
