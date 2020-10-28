import { observer } from 'mobx-react-lite'
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

export const AddToFavouritesBtn = observer(function AddToFavouritesBtn({
  fontSize
}: {
  fontSize: string | number
}) {
  const stationInFavourites = true
  const classes = useStyles({ fontSize })

  return stationInFavourites ? (
    <Tooltip
      placement="top"
      title="Remove from favourites"
      aria-label="Remove from favourites"
    >
      <IconButton className={classes.button} size="medium">
        <FullHeart classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip
      placement="top"
      title="Add to favourites"
      aria-label="Add to favourites"
    >
      <IconButton className={classes.button} size="medium">
        <EmptyHeart classes={{ root: classes.icon }} />
      </IconButton>
    </Tooltip>
  )
})
