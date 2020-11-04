import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'

export function DefaultMenuItems({
  onClick
}: {
  onClick?: (...args: any[]) => void
}) {
  return (
    <>
      <AppMenuItem link={{ href: '/search' }} onClick={onClick}>
        Search
      </AppMenuItem>
    </>
  )
}
