import { useEffect } from 'react'
import { isNode } from './node.js'

const defaultPrompt = 'Are you sure you want to leave this page?'
const interceptors = new Set()

export function navigate(url, queryParams = false, replace = false) {
  if (typeof url !== 'string') {
    throw new Error(`"url" must be a string, was provided a(n) ${typeof url}`)
  }
  if (Array.isArray(queryParams)) {
    throw new Error(
      '"queryParams" must be boolean, object, or URLSearchParams'
    )
  }
  if (shouldCancelNavigation()) return
  if (queryParams !== null && typeof queryParams === 'object') {
    url += '?' + new URLSearchParams(queryParams).toString()
  }
  window.history[`${replace ? 'replace' : 'push'}State`](null, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}

export function useNavigationPrompt(predicate = true, prompt = defaultPrompt) {
  if (isNode) return
  useEffect(() => {
    const handler = e => {
      if (predicate) {
        return e ? cancelNavigation(e, prompt) : prompt
      }
    }
    addInterceptor(handler)
    return () => removeInterceptor(handler)
  }, [predicate, prompt])
}

export function shouldCancelNavigation() {
  // confirm if any interceptors return true
  return Array.from(interceptors).some(interceptor => {
    let prompt = interceptor()
    if (!prompt) return false
    // cancel navigation if user declines
    return !window.confirm(prompt) // eslint-disable-line no-alert
  })
}

function addInterceptor(handler) {
  window.addEventListener('beforeunload', handler)
  interceptors.add(handler)
}

function removeInterceptor(handler) {
  window.removeEventListener('beforeunload', handler)
  interceptors.delete(handler)
}

function cancelNavigation(event, prompt) {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = prompt
  // Return value for prompt per spec
  return prompt
}
