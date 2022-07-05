import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Link, { LinkProps } from 'next/link'
import { MouseEvent, ReactNode, useEffect, useState } from 'react'

export function AppMenuItem({
  onClick,
  link,
  icon,
  primary,
  secondary = '',
  selected = false,
  testId
}: {
  link?: LinkProps
  testId?: string
  primary?: string
  secondary?: string
  onClick?: (...args: any[]) => void
  selected?: boolean
  children?: ReactNode
  icon?: ReactNode
}) {
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
      data-test={testId}
      onClick={handleClick}
      selected={clientRender && selected}
    >
      {icon}
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  )

  return (
    <>
      {link ? (
        <Link {...link} passHref>
          {Item}
        </Link>
      ) : (
        <>{Item}</>
      )}
    </>
  )
}
