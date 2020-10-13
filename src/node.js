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

export function setPath(path) {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  const url = require('url') // eslint-disable-line import/no-nodejs-modules
  setSsrPath(url.resolve(getSsrPath(), path))
}
