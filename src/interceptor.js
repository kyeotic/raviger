import { useEffect } from 'react'
import { isPromise } from './typeChecks.js'

export function useInterceptor(interceptorFn, deps) {
  useEffect(() => {
    const handler = e => {
      const result = interceptorFn(e)
      if (isPromise(result)) {
        cancelNavigation(e)
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [deps])
}

function cancelNavigation(event) {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = ''
}
