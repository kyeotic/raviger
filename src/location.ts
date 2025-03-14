import { useState, useCallback, useRef, useContext, useLayoutEffect } from 'react'

import { BasePathContext, PathContext } from './context'
import { useMountedLayout } from './hooks'
import { getSsrPath, isNode } from './node'
import { shouldCancelNavigation } from './intercept'
import { isFunction } from './typeChecks'

export interface RavigerLocation {
  /** The current path; alias of `pathname` */
  path: string | null
  /** The current path; alias of `path` */
  pathname: string | null
  /** The full path, ignores any `basePath` in the context */
  fullPath: string
  basePath?: string
  search: string
  hash: string
  host: string
  hostname: string
  href: string
  origin: string
}

export interface RavigerHistory {
  scrollRestoration: 'auto' | 'manual'
  state: unknown
}

export interface LocationChangeSetFn {
  (location: RavigerLocation): void
}
export interface LocationChangeOptionParams {
  inheritBasePath?: boolean
  basePath?: string
  isActive?: boolean | (() => boolean)
  onInitial?: boolean
}

export function usePath(basePath?: string): string | null {
  const contextPath = useContext(PathContext)
  const contextBasePath = useBasePath() // hooks can't be called conditionally
  basePath = basePath || contextBasePath

  // Don't bother tracking the actual path, it can get out of sync
  // due to React parent/child render ordering, especially with onmount navigation
  // See issues:
  // https://github.com/kyeotic/raviger/issues/116
  // https://github.com/kyeotic/raviger/issues/64
  //
  // This is just used to force a re-render
  const [, setPath] = useState(getFormattedPath(basePath))
  const onChange = useCallback(({ path: newPath }) => setPath(newPath), [])
  useLocationChange(onChange, {
    basePath,
    inheritBasePath: !basePath,
    // Use on initial to handle to force state updates from on-mount navigation
    onInitial: true,
  })

  return contextPath || getFormattedPath(basePath)
}

export function useBasePath(): string {
  return useContext(BasePathContext)
}

export function useFullPath(): string {
  const [path, setPath] = useState<string | null>(getCurrentPath())
  const onChange = useCallback(({ path: newPath }) => setPath(newPath), [])
  useLocationChange(onChange, { inheritBasePath: false })

  return path || '/'
}

export function useHash({ stripHash = true } = {}): string {
  const [hash, setHash] = useState(window.location.hash)
  const handleHash = useCallback(() => {
    const newHash = window.location.hash
    if (newHash === hash) return
    setHash(newHash)
  }, [setHash, hash])

  useLayoutEffect(() => {
    window.addEventListener('hashchange', handleHash, false)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [handleHash])

  useLocationChange(handleHash)
  return stripHash ? hash.substring(1) : hash
}

export function getCurrentPath(): string {
  return isNode ? getSsrPath() : window.location.pathname || '/'
}

export function getCurrentHash(): string {
  if (isNode) {
    const path = getSsrPath()
    const hashIndex = path.indexOf('#')
    return path.substring(hashIndex)
  }
  return window.location.hash
}

export function useLocationChange(
  setFn: LocationChangeSetFn,
  {
    inheritBasePath = true,
    basePath = '',
    isActive,
    onInitial = false,
  }: LocationChangeOptionParams = {},
): void {
  if (isNode) return

  // All hooks after this are conditional, but the runtime can't actually change

  const routerBasePath = useBasePath()
  if (inheritBasePath && routerBasePath) basePath = routerBasePath

  const setRef = useRef<LocationChangeSetFn>(setFn)
  useLayoutEffect(() => {
    // setFn could be an in-render declared callback, making it unstable
    // This is a method of using an often-changing callback from React Hooks
    // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
    // While not recommended, it is the best current (16.9) available method
    // For reducing the useEffect cleanup from setFn changing every render
    setRef.current = setFn
  })

  const onPopState = useCallback(() => {
    // No predicate defaults true
    if (isActive !== undefined && !isPredicateActive(isActive)) return
    if (shouldCancelNavigation()) return
    setRef.current(getFormattedLocation(basePath))
  }, [isActive, basePath])

  useLayoutEffect(() => {
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [onPopState])

  // When the basePath changes re-check the path after the render completes
  // This allows nested contexts to get an up-to-date formatted path
  useMountedLayout(
    () => {
      if (isActive !== undefined && !isPredicateActive(isActive)) return
      setRef.current(getFormattedLocation(basePath))
    },
    [basePath, isActive],
    { onInitial },
  )
}

export function useHistory(): RavigerHistory {
  const [history, setHistory] = useState(getRavigerHistory())
  useLocationChange(useCallback(() => setHistory(getRavigerHistory()), [setHistory]))
  return history
}

function getRavigerHistory(): RavigerHistory {
  if (isNode) return { scrollRestoration: 'manual', state: null }
  return {
    scrollRestoration: window.history.scrollRestoration,
    state: window.history.state,
  }
}

/**
 * Returns the current path after decoding. If basePath is provided it will be removed from the front of the path.
 * If basePath is provided and the path does not begin with it will return null
 * @param {string} basePath basePath, if any
 * @return {string | null} returns path with basePath prefix removed, or null if basePath is provided and missing
 */
export function getFormattedPath(basePath: string): string | null {
  const path = getCurrentPath()
  const baseMissing = basePath && !isPathInBase(basePath, path)
  if (path === null || baseMissing) return null
  return decodeURIComponent(!basePath ? path : path.replace(basePathMatcher(basePath), '') || '/')
}

function getFormattedLocation(basePath: string): RavigerLocation {
  const path = getFormattedPath(basePath)
  return {
    basePath,
    path,
    pathname: path,
    fullPath: getCurrentPath(),
    search: window.location.search,
    hash: getCurrentHash(),
    host: window.location.host,
    hostname: window.location.hostname,
    href: window.location.href,
    origin: window.location.origin,
  }
}

function isPredicateActive(predicate: boolean | (() => boolean)): boolean {
  return isFunction(predicate) ? predicate() : predicate
}

function basePathMatcher(basePath: string): RegExp {
  return new RegExp('^' + basePath, 'i')
}

function isPathInBase(basePath: string, path: string): boolean {
  return !!(basePath && path && path.toLowerCase().startsWith(basePath.toLowerCase()))
}
