import { useCallback, useLayoutEffect } from 'react'

import { useBasePath } from './path'
import { isNode } from './node'
import type { QueryParam } from './querystring'
import {
  shouldCancelNavigation,
  addInterceptor,
  removeInterceptor,
  defaultPrompt,
  undoNavigation,
} from './intercept'

export interface NavigateWithReplace {
  (url: string, replace?: boolean): void
}

export interface NavigateOptions {
  /**
   * Use a `replace` instead of `push` for navigation
   * @default false */
  replace?: boolean
  /** Values to serialize as a querystring, which will be appended to the `url` */
  query?: QueryParam | URLSearchParams
  /**  value to pass as the state/data to history push/replace*/
  state?: unknown
}

let lastPath = ''

export function navigate(url: string, options?: NavigateOptions): void {
  if (typeof url !== 'string') {
    throw new Error(`"url" must be a string, was provided a(n) ${typeof url}`)
  }

  if (Array.isArray(options?.query)) {
    throw new Error('"query" a serializable object or URLSearchParams')
  }

  if (shouldCancelNavigation()) return
  if (options?.query) {
    url += '?' + new URLSearchParams(options.query).toString()
  }

  lastPath = url
  // if the origin does not match history navigation will fail with
  // "cannot be created in a document with origin"
  // When navigating to another domain we must use location instead of history
  if (isAbsolute(url) && !isCurrentOrigin(url)) {
    window.location.assign(url)
    return
  }

  if (options?.replace) window.history.replaceState(options?.state, '', url)
  else window.history.pushState(options?.state, '', url)

  const event = new PopStateEvent('popstate')
  // Tag the event so navigation can be filtered out from browser events
  ;(event as any).__tag = 'raviger:navigation'
  dispatchEvent(event)
}

export function useNavigationPrompt(predicate = true, prompt: string = defaultPrompt): void {
  if (isNode) return

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const onPopStateNavigation = () => {
      if (shouldCancelNavigation()) {
        undoNavigation(lastPath)
      }
    }
    window.addEventListener('popstate', onPopStateNavigation)
    return () => window.removeEventListener('popstate', onPopStateNavigation)
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const handler = (e?: BeforeUnloadEvent): string | void => {
      if (predicate) {
        return e ? cancelNavigation(e, prompt) : prompt
      }
    }
    addInterceptor(handler)
    return () => removeInterceptor(handler)
  }, [predicate, prompt])
}

function cancelNavigation(event: BeforeUnloadEvent, prompt: string) {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = prompt
  // Return value for prompt per spec
  return prompt
}

export function useNavigate(optBasePath = ''): typeof navigate {
  const basePath = useBasePath()
  const navigateWithBasePath = useCallback<typeof navigate>(
    (url: string, options?: NavigateOptions) => {
      const base = optBasePath || basePath
      const href = url.startsWith('/') ? base + url : url
      navigate(href, options)
    },
    [basePath, optBasePath]
  )
  return navigateWithBasePath
}

function isAbsolute(url: string) {
  return /^(?:[a-z]+:)?\/\//i.test(url)
}

function isCurrentOrigin(url: string) {
  return window.location.origin === new URL(url).origin
}
