import React, { useCallback, forwardRef } from 'react'

import { navigate } from './navigate'
import { usePath, useBasePath } from './path'

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

const Link = forwardRef<LinkRef, LinkProps>(
  ({ href, basePath, ...props }, ref) => {
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
)

export default Link
export { Link }

const ActiveLink = forwardRef<LinkRef, ActiveLinkProps>((props, ref) => {
  const basePath = useBasePath()
  const path = usePath(basePath)
  const href = getLinkHref(props.href, basePath)
  // eslint-disable-next-line prefer-const
  let { className, activeClass, exactActiveClass, ...rest } = props

  if (!className) className = ''
  if (exactActiveClass && path === href) className += ` ${exactActiveClass}`
  if (activeClass && (path ?? '').startsWith(href))
    className += ` ${activeClass}`

  return <Link {...rest} className={className} ref={ref} />
})

export { ActiveLink }

function getLinkHref(href: string, basePath = '') {
  return href.substring(0, 1) === '/' ? basePath + href : href
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
