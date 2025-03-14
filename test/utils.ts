import { act } from 'react'

import { navigate } from '../src/main'

const originalConfirm = window.confirm
const originalScrollTo = window.scrollTo
const originalAssign = window.location.assign
const originalReplaceState = window.history.replaceState
const originalPushState = window.history.pushState

export function restoreWindow(): void {
  window.confirm = originalConfirm
  window.scrollTo = originalScrollTo
  window.history.replaceState = originalReplaceState
  window.history.pushState = originalPushState
  // This gets around location read-only error
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      assign: originalAssign,
    },
  })
}

export function mockNavigation(): void {
  beforeEach(() => {
    // restoreWindow()
    act(() => navigate('/'))
  })

  afterEach(async () => {
    restoreWindow()
    // We must wait for the intercept reset op
    return delay(5)
  })
}

export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
}
