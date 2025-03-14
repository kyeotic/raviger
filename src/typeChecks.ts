// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(obj: unknown): obj is Function {
  return !!obj && typeof obj === 'function'
}
