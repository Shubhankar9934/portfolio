// SessionStart hook: start the directory review watcher in the background if it
// is not already running. Returns immediately so the session is not delayed.

import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const child = spawn(process.execPath, [path.join(here, 'review-watcher.mjs')], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
  env: { ...process.env, CLAUDE_PROJECT_DIR: process.env.CLAUDE_PROJECT_DIR ?? path.resolve(here, '..', '..') },
})
child.unref()
