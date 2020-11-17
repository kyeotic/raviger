---
title: "ActiveLink"
date: 2019-09-30T18:21:44-07:00
weight: 4
---

Like the standard [Link](/api/link) component, but with built-in `className` transormation when a matching path is detected.

## API

{{< highlight typescript >}}
export interface ActiveLinkProps extends LinkProps {
  activeClass?: string
  exactActiveClass?: string
}
export const ActiveLink: React.ForwardRefExoticComponent<ActiveLinkProps & React.RefAttributes<HTMLAnchorElement>>
{{< /highlight >}}

## Basic

Just like `<Link>`, but with two additional properties for modifying the `className`

* **activeClass** If the `href` matches the start of the current path this will be appended to the `<a>` `className`.
* **exactActiveClass** If the `href` matches the cirrent path exactly this will be appended to the `<a>` `className`. Stacks with *activeClass*

{{< highlight jsx>}}
<ActiveLink
  href="/foo"
  activeClass="when-path-is-prefix"
  exactActiveClass="when-path-is-exact"
  >
  go to foo
</ActiveLink>
{{< /highlight >}}

## Ref passing

`ActiveLink` supports the standard [forwardRef](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) API.