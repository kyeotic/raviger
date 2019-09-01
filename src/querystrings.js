import { isNode, getSsrPath } from './node.js'

export function parseQuery(querystring) {
  return [...new URLSearchParams(querystring)].reduce(
    (result, [key, value]) => {
      result[key] = decodeURIComponent(value)
      return result
    },
    {}
  )
}

export function serializeQuery(queryParams) {
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
