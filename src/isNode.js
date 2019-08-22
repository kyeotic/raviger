let wIsNode = true // eslint-disable-line import/no-mutable-exports
try {
  wIsNode = window === undefined
} catch (e) {} // eslint-disable-line no-empty

export default wIsNode
