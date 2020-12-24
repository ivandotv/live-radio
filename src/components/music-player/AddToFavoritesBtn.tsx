import { observer } from 'mobx-react-lite'
import { t } from '@lingui/macro'
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      padding: 0
    },
    icon: {
      fontSize: ({ fontSize }: { fontSize: string | number }) => fontSize,
      color: theme.palette.primary.contrastText
    }
  })
)

export const AddTofavoritesBtn = observer(function AddTofavoritesBtn({
  fontSize,
  active,
  onClick
}: {
  fontSize: string | number
  active: boolean
  onClick: () => void
}) {
  const classes = useStyles({ fontSize })

  const titleRemove = t`Remove station from favorites`
  const titleAdd = t`Add station to favorites`

  return active ? (
    <Tooltip placement="top" title={titleRemove} aria-label={titleRemove}>
      <IconButton className={classes.button} size="medium" onClick={onClick}>
        <FullHeart classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip placement="top" title={titleAdd} aria-label={titleAdd}>
      <IconButton className={classes.button} size="medium" onClick={onClick}>
        <EmptyHeart classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )
})
