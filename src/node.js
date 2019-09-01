let ssrPath = '/'
let isNode = true // eslint-disable-line import/no-mutable-exports
try {
  isNode = window === undefined
} catch (e) {} // eslint-disable-line no-empty

export { isNode }
export function getSsrPath() {
  return ssrPath
}
export function setSsrPath(path) {
  ssrPath = path
}
