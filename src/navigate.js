export function navigate(url, replaceOrQuery = false, replace = false) {
  if (typeof url === 'object') {
    throw new Error('"url" must be a string, was provided an object.')
  }
  if (replaceOrQuery && typeof replaceOrQuery === 'object') {
    url += '?' + new URLSearchParams(replaceOrQuery).toString()
  } else {
    replace = replaceOrQuery
  }
  window.history[`${replace ? 'replace' : 'push'}State`](null, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}
