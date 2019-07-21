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
