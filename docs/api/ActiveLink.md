---
title: "ActiveLink"
permalink: /active-link/
nav_order: 4
---

Like the standard [Link](/api/link) component, but with built-in `className` transormation when a matching path is detected.

## API

```typescript
export interface ActiveLinkProps extends LinkProps {
  activeClass?: string
  exactActiveClass?: string
}
export const ActiveLink: React.ForwardRefExoticComponent<ActiveLinkProps & React.RefAttributes<HTMLAnchorElement>>
```

## Basic

Just like `<Link>`, but with two additional properties for modifying the `className`

* **activeClass** If the `href` matches the start of the current path this will be appended to the `<a>` `className`.
* **exactActiveClass** If the `href` matches the cirrent path exactly this will be appended to the `<a>` `className`. Stacks with *activeClass*

```jsx
<ActiveLink
  href="/foo"
  activeClass="when-path-is-prefix"
  exactActiveClass="when-path-is-exact"
  >
  go to foo
</ActiveLink>
```

## Ref passing

`ActiveLink` supports the standard [forwardRef](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) API.