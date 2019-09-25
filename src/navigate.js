export function navigate(url, replaceOrQuery = false, replace = false) {
  if (typeof url !== 'string') {
    throw new Error(`"url" must be a string, was provided a(n) ${typeof url}.`)
  }
  if (
    !Array.isArray(replaceOrQuery) &&
    replaceOrQuery !== null &&
    typeof replaceOrQuery === 'object'
  ) {
    url += '?' + new URLSearchParams(replaceOrQuery).toString()
  } else {
    replace = replaceOrQuery
  }
  window.history[`${replace ? 'replace' : 'push'}State`](null, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}
