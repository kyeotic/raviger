const interceptors = new Set<() => string>()

export const defaultPrompt = 'Are you sure you want to leave this page?'

let hasIntercepted = false
let hasUserCancelled = false
let lastScroll = [0, 0] as [number, number]

export function shouldCancelNavigation() {
  lastScroll = [window.scrollX, window.scrollY]
  if (hasIntercepted) return hasUserCancelled
  // confirm if any interceptors return true
  return Array.from(interceptors).some((interceptor) => {
    const prompt = interceptor()
    if (!prompt) return false
    // cancel navigation if user declines
    hasUserCancelled = !window.confirm(prompt) // eslint-disable-line no-alert
    // track user response so that multiple interceptors don't prompt
    hasIntercepted = true
    // reset so that future navigation attempts are prompted
    setTimeout(() => {
      hasIntercepted = false
      hasUserCancelled = false
    }, 5)
    return hasUserCancelled
  })
}

export function addInterceptor(handler: () => string) {
  window.addEventListener('beforeunload', handler)
  interceptors.add(handler)
}

export function removeInterceptor(handler: () => string) {
  window.removeEventListener('beforeunload', handler)
  interceptors.delete(handler)
}

export function undoNavigation(lastPath: string) {
  window.history.pushState(null, null as unknown as string, lastPath)
  setTimeout(() => {
    window.scrollTo(...lastScroll)
  }, 0)
}
