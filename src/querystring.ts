import { useState, useCallback } from 'react'

import { navigate } from './navigate'
import { isNode, getSsrPath } from './node'
import { getCurrentPath, getCurrentHash, usePathChange } from './location'

export interface QueryParam {
  [key: string]: any
}

export interface setQueryParamsOptions {
  replace?: boolean
}

export function useQueryParams<T extends QueryParam>(
  parseFn: (query: string) => T = parseQuery,
  serializeFn: (query: Partial<T>) => string = serializeQuery
): [T, (query: T, options?: setQueryParamsOptions) => void] {
  const [querystring, setQuerystring] = useState(getQueryString())
  const setQueryParams = useCallback(
    (params, { replace = true } = {}) => {
      let path = getCurrentPath()
      params = replace ? params : { ...parseFn(querystring), ...params }
      const serialized = serializeFn(params).toString()

      if (serialized) path += '?' + serialized
      if (!replace) path += getCurrentHash()

      navigate(path)
    },
    [querystring, parseFn, serializeFn]
  )

  // Update state when route changes
  const updateQuery = useCallback(() => setQuerystring(getQueryString()), [])

  usePathChange(updateQuery)
  return [parseFn(querystring), setQueryParams]
}

function parseQuery<T extends QueryParam>(querystring: string): T {
  const q = new URLSearchParams(querystring)
  return Object.fromEntries(q.entries()) as T
}

function serializeQuery<T extends QueryParam>(queryParams: T): string {
  return new URLSearchParams(Object.entries(queryParams).filter(([, v]) => v !== null)).toString()
}

export function getQueryString(): string {
  if (isNode) {
    const ssrPath = getSsrPath()
    const queryIndex = ssrPath.indexOf('?')
    return queryIndex === -1 ? '' : ssrPath.substring(queryIndex + 1)
  }
  return window.location.search
}
