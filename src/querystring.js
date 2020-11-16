import { useState, useCallback } from 'react'
import { isNode, getSsrPath } from './node.js'
import { navigate } from './navigate.js'
import { getCurrentPath, useLocationChange, getCurrentHash } from './path.js'

export function useQueryParams(
  parseFn = parseQuery,
  serializeFn = serializeQuery
) {
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
  const updateQuery = useCallback(() => setQuerystring(getQueryString()), [
    setQueryParams
  ])
  useLocationChange(updateQuery)
  return [parseFn(querystring), setQueryParams]
}

function parseQuery(querystring) {
  return Object.fromEntries(new URLSearchParams(querystring).entries())
}

function serializeQuery(queryParams) {
  return new URLSearchParams(
    Object.entries(queryParams).filter(([, v]) => v !== null)
  )
}

export function getQueryString() {
  if (isNode) {
    let ssrPath = getSsrPath()
    let queryIndex = ssrPath.indexOf('?')
    return queryIndex === -1 ? '' : ssrPath.substring(queryIndex + 1)
  }
  return location.search
}
