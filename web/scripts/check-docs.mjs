// Checks that the progress-tracking files stay consistent: ADR index, ADR references,
// tasks.md checkbox markers and the "Last updated" line, and the CLAUDE.md progress section.
// Usage: npm run test:docs                                   (checks the repo)
//        DOCS_ROOT=/some/copy node scripts/check-docs.mjs    (checks another root, for negative tests)
import { readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Default root assumes this file stays at web/scripts/.
const root = process.env.DOCS_ROOT ?? fileURLToPath(new URL('../../', import.meta.url))
const results = []

function check(name, ok, detail = '', skipped = false) {
  results.push({ name, ok, detail, skipped })
}

async function load(rel) {
  try {
    return await readFile(path.join(root, rel), 'utf8')
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

const tasks = await load('tasks.md')
const claude = await load('CLAUDE.md')
const index = await load('decisions/README.md')
let decisionFiles = []
try {
  decisionFiles = (await readdir(path.join(root, 'decisions'))).filter((f) => /^\d{4}-.+\.md$/.test(f)).sort()
} catch (err) {
  if (err.code !== 'ENOENT') throw err
  decisionFiles = []
}

const required = { 'tasks.md': tasks, 'CLAUDE.md': claude, 'decisions/README.md': index }
const missing = Object.keys(required).filter((k) => required[k] === null)
check('required docs exist', missing.length === 0, missing.join(', '))

if (missing.length === 0) {
  // 1. Every ADR file is listed in the index, and every index link points at a real file.
  const indexLinks = [...index.matchAll(/\]\((?:\.\/)?(\d{4}-[^)#]+\.md)\)/g)].map((m) => m[1])
  const missingFromIndex = decisionFiles.filter((f) => !indexLinks.includes(f))
  check('every ADR is listed in decisions/README.md', missingFromIndex.length === 0, missingFromIndex.join(', '))
  const brokenIndexLinks = indexLinks.filter((f) => !decisionFiles.includes(f))
  check('every index link points to an existing ADR', brokenIndexLinks.length === 0, brokenIndexLinks.join(', '))

  // 1b. No two ADR files share a number.
  const numbers = decisionFiles.map((f) => f.slice(0, 4))
  const duplicates = [...new Set(numbers.filter((n, i) => numbers.indexOf(n) !== i))]
  check('ADR numbers are unique', duplicates.length === 0, duplicates.join(', '))

  // 2. Every ADR has a valid Status line; "Superseded by NNNN" must name an existing ADR.
  const adrNumbers = new Set(numbers)
  const badStatus = []
  for (const f of decisionFiles) {
    let body = ''
    try {
      body = await readFile(path.join(root, 'decisions', f), 'utf8')
    } catch {
      badStatus.push(`${f} (unreadable)`)
      continue
    }
    const status = body.match(/^- Status: (Proposed|Accepted|Superseded by (\d{4}))\s*$/m)
    if (!status || (status[2] && !adrNumbers.has(status[2]))) badStatus.push(f)
  }
  check('every ADR has a valid Status line', badStatus.length === 0, badStatus.join(', '))

  // 3. ADR numbers referenced in tasks.md and CLAUDE.md must exist.
  const refs = new Set([
    ...[...tasks.matchAll(/ADR-(\d{4})/g)].map((m) => m[1]),
    ...[...claude.matchAll(/ADR-(\d{4})/g)].map((m) => m[1]),
  ])
  const dangling = [...refs].filter((n) => !adrNumbers.has(n))
  check('ADR numbers in tasks.md and CLAUDE.md exist', dangling.length === 0, dangling.map((n) => `ADR-${n}`).join(', '))

  // 4. Checkbox markers in tasks.md (list items with -, *, or +) use only the legend values.
  const badBoxes = tasks
    .split('\n')
    .map((line) => line.match(/^\s*[-*+] \[([^\]]*)\](?!\()/)) // (?!\() skips links like [text](url)
    .filter((m) => m && !/^[ ~x!]$/.test(m[1]))
    .map((m) => m[0].trim())
  check('tasks.md checkboxes use only [ ] [~] [x] [!]', badBoxes.length === 0, badBoxes.join(' | '))

  // 5. tasks.md has a Last updated line with a valid date and a commit that exists in git.
  const last = tasks.match(/\*\*Last updated:\*\* (\d{4}-\d{2}-\d{2}) \(commit `([0-9a-f]{7,40})`/)
  const validDate = last && !Number.isNaN(Date.parse(last[1])) && new Date(last[1]).toISOString().startsWith(last[1])
  check('tasks.md has a Last updated line with date and commit', Boolean(validDate), 'expected: **Last updated:** YYYY-MM-DD (commit `hash`')
  if (validDate) {
    if (!existsSync(path.join(root, '.git'))) {
      check('Last updated commit exists in git history', true, 'no .git in root', true)
    } else {
      let detail = last[2]
      let commitExists = false
      let gitMissing = false
      try {
        execFileSync('git', ['-C', root, 'cat-file', '-e', `${last[2]}^{commit}`], { stdio: 'pipe' })
        commitExists = true
      } catch (err) {
        gitMissing = err.code === 'ENOENT'
        detail = gitMissing ? 'git not installed' : `${last[2]} (${String(err.stderr ?? err.message).trim()})`
      }
      if (gitMissing) check('Last updated commit exists in git history', true, 'git not installed', true)
      else check('Last updated commit exists in git history', commitExists, detail)
    }
  }

  // 6. CLAUDE.md keeps the progress process section.
  check('CLAUDE.md has the Progress process section', /^## Progress process/m.test(claude))
}

const failed = results.filter((r) => !r.ok)
for (const r of results) {
  const label = r.skipped ? 'SKIP' : r.ok ? 'PASS' : 'FAIL'
  const note = r.detail && (!r.ok || r.skipped) ? `  (${r.detail})` : ''
  console.log(`${label}  ${r.name}${note}`)
}
const passed = results.filter((r) => r.ok && !r.skipped).length
const ran = results.filter((r) => !r.skipped).length
console.log(`\n${passed}/${ran} checks passed${results.some((r) => r.skipped) ? ' (some skipped)' : ''}`)
process.exit(failed.length ? 1 : 0)
