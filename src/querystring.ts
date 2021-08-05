import { useState, useCallback } from 'react'
import { navigate, useLocationChange } from '.'
import { isNode, getSsrPath } from './node'
import { getCurrentPath, getCurrentHash } from './path'

export interface QueryParam {
  [key: string]: any
}

export interface setQueryParamsOptions {
  replace?: boolean
}

export function useQueryParams(
  parseFn: (query: string) => QueryParam = parseQuery,
  serializeFn: (query: QueryParam) => string = serializeQuery
): [QueryParam, (query: QueryParam, options?: setQueryParamsOptions) => void] {
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
    [querystring]
  )
  // Update state when route changes
  const updateQuery = useCallback(
    () => setQuerystring(getQueryString()),
    [setQueryParams]
  )
  useLocationChange(updateQuery)
  return [parseFn(querystring), setQueryParams]
}

function parseQuery(querystring: string) {
  const q = new URLSearchParams(querystring)
  return Object.fromEntries(q.entries())
}

function serializeQuery(queryParams: QueryParam): string {
  return new URLSearchParams(
    Object.entries(queryParams).filter(([, v]) => v !== null)
  ).toString()
}

export function getQueryString() {
  if (isNode) {
    let ssrPath = getSsrPath()
    let queryIndex = ssrPath.indexOf('?')
    return queryIndex === -1 ? '' : ssrPath.substring(queryIndex + 1)
  }
  return location.search
}
