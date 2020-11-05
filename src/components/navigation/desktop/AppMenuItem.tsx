import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Link, { LinkProps } from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { ReactNode, useEffect, useState, MouseEvent } from 'react'

export function AppMenuItem({
  onClick,
  link,
  icon,
  primary,
  secondary = '',
  selected
}: {
  link?: LinkProps
  primary?: string
  secondary?: string
  onClick?: (...args: any[]) => void
  selected?: (router: NextRouter) => boolean
  children?: ReactNode
  icon?: ReactNode
}) {
  const router = useRouter()
  const [clientRender, setClientRender] = useState(false)

  // https://nextjs.org/docs/routing/shallow-routing#caveats
  useEffect(() => {
    setClientRender(true)
  }, [])

  const handleClick = (e: MouseEvent) => {
    if (onClick) {
      onClick(e)
    }
  }

  const Item = (
    <ListItem
      button
      component="a"
      onClick={handleClick}
      selected={clientRender && selected && selected(router)}
    >
      {icon}
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )

  const linkWrap = link ? (
    <Link {...link} passHref>
      {Item}
    </Link>
  ) : (
    <>{Item}</>
  )

  return <>{linkWrap}</>
}