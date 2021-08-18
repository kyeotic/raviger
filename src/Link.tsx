import React, { useCallback, forwardRef, Ref } from 'react'

import { navigate } from './navigate'
import { useBasePath, useFullPath } from './path'

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  basePath?: string
  children?: React.ReactNode
}
export type LinkRef = HTMLAnchorElement | null

export interface ActiveLinkProps extends LinkProps {
  activeClass?: string
  exactActiveClass?: string
}

function Link(
  { href, basePath, ...props }: LinkProps,
  ref?: Ref<HTMLAnchorElement>
) {
  const contextBasePath = useBasePath()
  basePath = basePath || contextBasePath
  href = getLinkHref(href, basePath)

  const { onClick, target } = props

  const handleClick = useCallback<React.MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      try {
        if (onClick) onClick(e)
      } catch (ex) {
        e.preventDefault()
        throw ex
      }
      if (shouldTrap(e, target)) {
        e.preventDefault() // prevent the link from actually navigating
        navigate(e.currentTarget.href)
      }
    },
    [onClick, target]
  )

  return <a {...props} href={href} onClick={handleClick} ref={ref} />
}

const RefLink = forwardRef<LinkRef, LinkProps>(Link) as (
  props: LinkProps & { ref?: React.ForwardedRef<HTMLAnchorElement> }
) => ReturnType<typeof Link>

export default RefLink
export { RefLink as Link }

function ActiveLink(
  {
    basePath,
    className,
    exactActiveClass,
    activeClass,
    ...props
  }: ActiveLinkProps,
  ref?: Ref<HTMLAnchorElement>
) {
  const contextBasePath = useBasePath()
  basePath = basePath || contextBasePath
  const fullPath = useFullPath()

  let { href } = props
  href = absolutePathName(getLinkHref(href, basePath))

  if (exactActiveClass && fullPath === href) className += ` ${exactActiveClass}`
  if (activeClass && fullPath.startsWith(href)) className += ` ${activeClass}`

  return (
    <RefLink {...props} basePath={basePath} className={className} ref={ref} />
  )
}

const ActiveLinkRef = forwardRef<LinkRef, ActiveLinkProps>(ActiveLink) as (
  props: ActiveLinkProps & { ref?: React.ForwardedRef<HTMLAnchorElement> }
) => ReturnType<typeof ActiveLink>

export { ActiveLinkRef as ActiveLink }

function getLinkHref(href: string, basePath = '') {
  return href.startsWith('/') ? basePath + href : href
}

function absolutePathName(href: string): string {
  if (href.startsWith('/')) return href
  return new URL(href, document.baseURI).pathname
}

function shouldTrap(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  target?: string
) {
  return (
    !e.defaultPrevented && // onClick prevented default
    e.button === 0 && // ignore everything but left clicks
    !(target || target === '_self') && // don't trap target === blank
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
  )
}
