import { useEffect } from 'react'
import { isNode } from './node.js'

const defaultPrompt = 'Are you sure you want to leave this page?'
const interceptors = new Set()

export function useInterceptor(predicate = true, prompt = defaultPrompt) {
  if (isNode) return
  useEffect(() => {
    const handler = e => {
      if (predicate) {
        return e ? cancelNavigation(e, prompt) : prompt
      }
    }
    addListener(handler)
    return () => removeListenter(handler)
  }, [predicate, prompt])
}

export function shouldCancelNavigation() {
  // confirm if any interceptors return true
  return Array.from(interceptors).some(interceptor => {
    let prompt = interceptor()
    if (!prompt) return false
    // cancel navigation if user declines
    return !window.confirm(prompt) // eslint-disable-line no-alert
  })
}

function addListener(handler) {
  window.addEventListener('beforeunload', handler)
  interceptors.add(handler)
}

function removeListenter(handler) {
  window.removeEventListener('beforeunload', handler)
  interceptors.delete(handler)
}

function cancelNavigation(event, prompt) {
  // Cancel the event as stated by the standard.
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = prompt
  // Return value for prompt per spec
  return prompt
}
