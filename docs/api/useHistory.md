---
title: "useHistory"
permalink: /use-history/
nav_order: 11
---

# `useHistory`

Get the current browser history state and scroll restoration setting. This hook provides access to the browser's history API state and scroll restoration behavior, updating automatically when the location changes.

## API

```typescript
export function useHistory(): RavigerHistory

interface RavigerHistory {
  scrollRestoration: 'auto' | 'manual'
  state: unknown
}
```

## Properties

- **`scrollRestoration`**: The current scroll restoration mode ('auto' or 'manual')
- **`state`**: The current history state object, or `null` if no state is set

## Example

```typescript
import { useHistory } from 'raviger'

function MyComponent() {
  const history = useHistory()
  
  console.log('Scroll restoration:', history.scrollRestoration)
  console.log('History state:', history.state)
  
  return <div>Current state: {JSON.stringify(history.state)}</div>
}
```