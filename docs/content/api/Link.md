---
title: "Link"
date: 2019-09-30T18:16:24-07:00
weight: 3
---

A React component for rendering a `<a>` that uses *history* navigation for local URLs.

## API

{{< highlight typescript >}}
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Unlike normal <a>, this property is required
  href: string,
  linkRef?: React.RefObject<HTMLAnchorElement>
}
export const Link: React.FC<LinkProps>
{{< /highlight >}}

## Basic

This component is the preferred method of navigation, alongside the **navigate** function.

This component takes all the same parameters as the built-in `<a>` tag. It's `onClick` will be extended to perform local navigation, and if it is inside a component returned from `useRoutes` it will have the provided `basePath` preprended to its `href`.

{{< highlight jsx>}}
<Link href="/foo">
  go to foo
</Link>
{{< /highlight >}}

## Ref Passing

To pass a [React ref](https://reactjs.org/docs/refs-and-the-dom.html) to the `<Link>` DOM Node use the `linkRef` property. This will assign the ref to the internal `<a>` node. In future version this will become `ref` and use the standard [forwardRef](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) API.