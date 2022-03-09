import { t } from '@lingui/macro'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import { favoritesHeartColor } from 'browser-config'
import { observer } from 'mobx-react-lite'

type MakeStyleProps = {
  fontSize: string | number
  inFavorites: boolean
}
const useStyles = makeStyles<Theme, MakeStyleProps>((theme: Theme) =>
  createStyles({
    button: {
      padding: 0
    },
    icon: {
      fontSize: ({ fontSize }) => fontSize,
      color: ({ inFavorites }) =>
        inFavorites ? favoritesHeartColor : theme.palette.primary.contrastText
    }
  })
)

export const AddTofavoritesBtn = observer(function AddTofavoritesBtn({
  fontSize,
  active,
  inFavorites,
  onClick
}: {
  fontSize: string | number
  active: boolean
  inFavorites: boolean
  onClick: () => void
}) {
  const classes = useStyles({ fontSize, inFavorites })

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
