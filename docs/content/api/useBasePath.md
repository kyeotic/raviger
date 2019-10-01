---
title: "useBasePath"
date: 2019-09-30T18:42:29-07:00
weight: 8
---

Get the `basePath` set by a parent `useRoutes` component (empty string if none)

## API

{{< highlight typescript >}}
export function useBasePath(): string
{{< /highlight >}}

## Basic

{{< highlight jsx >}}
import { useRoutes, useBasePath } from 'raviger'

function Home () {
  let basePath = useBasePath()
  // Will be 'app' when render by the parent below
  return <span>{basePath}</span>
}

const routes = {
  '/': () => <Home />
}

export default function App() {
  return useRoutes(routes, { basePath: 'app' })
  )
}
{{< /highlight >}}
