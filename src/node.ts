let ssrPath = '/'
let isNode = true
try {
  isNode = window === undefined
} catch (e) {} // eslint-disable-line no-empty

export { isNode }
export function getSsrPath(): string {
  return ssrPath
}
export function setSsrPath(path: string): void {
  ssrPath = path
}
