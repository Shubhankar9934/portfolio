import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()

function read(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The initial theme is set by the inline script in index.html; this keeps React in sync with it. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'light' as Theme)

  const toggle = useCallback(() => {
    const next: Theme = read() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
    listeners.forEach((l) => l())
  }, [])

  return { theme, toggle }
}
