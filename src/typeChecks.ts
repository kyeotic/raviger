// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export function isFunction(obj: unknown): obj is Function {
  return !!obj && typeof obj === 'function'
}
