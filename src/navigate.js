import { useCallback, useLayoutEffect } from 'react'
import { isNode } from './node.js'
import { useBasePath } from './path.js'
import {
  shouldCancelNavigation,
  addInterceptor,
  removeInterceptor,
  defaultPrompt,
  undoNavigation
} from './intercept'

let lastPath = ''

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
  lastPath = url

  window.history[`${replace ? 'replace' : 'push'}State`](state, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}

export function useNavigationPrompt(predicate = true, prompt = defaultPrompt) {
  if (isNode) return
  useLayoutEffect(() => {
    const onPopStateNavigation = () => {
      if (shouldCancelNavigation()) {
        undoNavigation(lastPath)
      }
    }
    window.addEventListener('popstate', onPopStateNavigation)
    return () => window.removeEventListener('popstate', onPopStateNavigation)
  }, [])
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
