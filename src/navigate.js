import { useCallback, useLayoutEffect } from 'react'
import { isNode } from './node.js'
import { useBasePath } from './path.js'

const defaultPrompt = 'Are you sure you want to leave this page?'
const interceptors = new Set()

export function navigate(url, replaceOrQuery, replace, state = null) {
  if (typeof url !== 'string') {
    throw new Error(`"url" must be a string, was provided a(n) ${typeof url}`)
  }
  if (Array.isArray(replaceOrQuery)) {
    throw new Error(
      '"replaceOrQuery" must be boolean, object, or URLSearchParams'
    )
  }
  if (shouldCancelNavigation()) return
  if (replaceOrQuery !== null && typeof replaceOrQuery === 'object') {
    url += '?' + new URLSearchParams(replaceOrQuery).toString()
  } else if (replace === undefined && replaceOrQuery !== undefined) {
    replace = replaceOrQuery
  } else if (replace === undefined && replaceOrQuery === undefined) {
    replace = false
  }
  window.history[`${replace ? 'replace' : 'push'}State`](state, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}

export function useNavigationPrompt(predicate = true, prompt = defaultPrompt) {
  if (isNode) return
  useLayoutEffect(() => {
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

export function useNavigate(optBasePath = '') {
  const basePath = useBasePath()
  const navigateWithBasePath = useCallback(
    (url, replaceOrQuery, replace) => {
      const base = optBasePath || basePath
      const href = url.startsWith('/') ? base + url : url
      navigate(href, replaceOrQuery, replace)
    },
    [basePath, optBasePath]
  )
  return navigateWithBasePath
}
