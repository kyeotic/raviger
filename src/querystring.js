import { useState, useCallback } from 'react'
import { isNode, getSsrPath } from './node.js'
import { navigate } from './navigate.js'
import { getCurrentPath, useLocationChange } from './path.js'

export function useQueryParams(
  parseFn = parseQuery,
  serializeFn = serializeQuery
) {
  const [querystring, setQuerystring] = useState(getQueryString())
  const setQueryParams = useCallback(
    (params, replace = true) => {
      params = replace ? params : { ...parseFn(querystring), ...params }
      navigate(`${getCurrentPath()}?${serializeFn(params)}`)
    },
    [querystring]
  )
  // Watch for location changes
  useLocationChange(() => setQuerystring(getQueryString()))
  return [parseFn(querystring), setQueryParams]
}

function parseQuery(querystring) {
  return [...new URLSearchParams(querystring)].reduce(
    (result, [key, value]) => {
      result[key] = decodeURIComponent(value)
      return result
    },
    {}
  )
}

function serializeQuery(queryParams) {
  return Object.entries(queryParams).reduce((query, [key, value]) => {
    query.append(key, value)
    return query
  }, new URLSearchParams())
}

export function getQueryString() {
  if (isNode) {
    let ssrPath = getSsrPath()
    let queryIndex = ssrPath.indexOf('?')
    return queryIndex === -1 ? '' : ssrPath.substring(queryIndex + 1)
  }
  return location.search
}
