import { observer } from 'mobx-react-lite'
import FullHeart from '@material-ui/icons/Favorite'
import EmptyHeart from '@material-ui/icons/FavoriteBorder'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    button: {
      cursor: 'pointer',
      fontSize: ({ fontSize }: { fontSize: string | number }) => fontSize
    },
    heartColor: {
      color: '#ff0000'
    }
  })
)

export const AddToFavouritesBtn = observer(function AddToFavouritesBtn({
  fontSize
}: {
  fontSize: string | number
}) {
  // tood - show
  const stationInFavourites = false
  const classes = useStyles({ fontSize })

  return stationInFavourites ? (
    <Tooltip
      placement="top"
      title="Remove from favourites"
      aria-label="Remove from favourites"
    >
      <FullHeart className={`${classes.heartColor} ${classes.button}`} />
    </Tooltip>
  ) : (
    <Tooltip
      placement="top"
      title="Add to favourites"
      aria-label="Add to favourites"
    >
      <EmptyHeart className={`${classes.heartColor} ${classes.button}`} />
    </Tooltip>
  )
})
