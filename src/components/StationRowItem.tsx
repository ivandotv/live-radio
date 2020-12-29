import { t } from '@lingui/macro'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import HttpIcon from '@material-ui/icons/ErrorOutline'
import clsx from 'clsx'
import { PlayerStateIcon } from 'components/music-player/PlayerStateIcon'
import {
  useMusicPlayer,
  useRootStore
} from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { PlayerStatus } from 'lib/stores/MusicPlayerStore'
import { observer } from 'mobx-react-lite'
import { MouseEvent, useCallback } from 'react'
import { RadioStation } from 'types'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      padding: theme.spacing(1),
      paddingBottom: ({ showTags }: { showTags: boolean }) =>
        showTags ? 0 : theme.spacing(1),
      cursor: 'pointer',
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    buttonBase: {
      width: '100%'
    },
    btnRemove: {
      marginLeft: theme.spacing(1),
      fontSize: '0.6rem'
    },
    title: {
      display: 'flex',
      alignItems: 'center'
    },
    stationSelected: {
      borderLeft: `${theme.spacing(1)}px solid ${theme.palette.primary.light}`
    },
    stationError: {
      borderLeft: `${theme.spacing(1)}px solid ${theme.palette.error.main}`
    },
    tags: {
      display: 'block',
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    playerStateIcon: {
      margin: `0 ${theme.spacing(0.5)}px`,
      lineHeight: 1
    },
    httpIcon: {
      color: theme.palette.text.disabled,
      marginLeft: `${theme.spacing(0.5)}px`,
      fontSize: '1.2rem'
    }
  })
})

export const StationRowItem = observer(function StationRowItem({
  station,
  showCountry = true,
  showFlag = true,
  showTags = true,
  showRemoveBtn = false
}: {
  station: RadioStation
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  showRemoveBtn?: boolean
}) {
  const classes = useStyles({ showTags })
  const player = useMusicPlayer()
  const { favorites } = useRootStore()

  const httpIconTitle = t`Depending on your brower this station might not load beacuse it is not served over a secure connection`

  const togglePlay = useCallback(
    (_e: MouseEvent) => {
      player.togglePlay(station)
    },
    [player, station]
  )

  const stationError = player.errorStations[station.id]
  const removeFromfavorites = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      favorites.remove(station.id)
    },
    [favorites, station.id]
  )

  return (
    <div className={classes.buttonBase}>
      <ListItem
        button
        onClick={togglePlay}
        className={clsx(classes.root, {
          [classes.stationSelected]:
            player.station?.id === station.id &&
            player.status !== PlayerStatus.ERROR,
          [classes.stationError]: stationError
        })}
        component="div"
      >
        <ListItemText>
          <div className={classes.title}>
            <PlayerStateIcon
              className={classes.playerStateIcon}
              stationId={station.id}
              fontSize="1.3rem"
            />
            {`${station.name}`}
            {showCountry && station.country.length
              ? ` | ${station.country}`
              : null}
            {showFlag && station.flag.length ? ` ${station.flag}` : null}
            {station.url.indexOf('https') === -1 ? (
              <Tooltip title={httpIconTitle}>
                <HttpIcon className={classes.httpIcon} />
              </Tooltip>
            ) : null}
            {showRemoveBtn ? (
              <Tooltip title={t`Remove from favorites`}>
                <IconButton
                  aria-label={t`remove`}
                  className={classes.btnRemove}
                  size="small"
                  onClick={removeFromfavorites}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </div>

          {showTags ? (
            <StationRowTags className={classes.tags} station={station} />
          ) : null}
        </ListItemText>
      </ListItem>
    </div>
  )
})
