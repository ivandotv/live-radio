import ButtonBase from '@material-ui/core/ButtonBase'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { PlayerStateIcon } from 'components/music-player/PlayerStateIcon'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { PlayerStatus } from 'lib/stores/MusicPlayerStore'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useCallback } from 'react'
import { RadioStation } from 'types'
import HttpIcon from '@material-ui/icons/ErrorOutline'
import Tooltip from '@material-ui/core/Tooltip'

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
      // display: 'inline'
      lineHeight: 1
      // marginRight: theme.spacing(0.5)
    },
    httpIcon: {
      color: theme.palette.text.disabled,
      margin: `0 ${theme.spacing(0.5)}px`,
      fontSize: '1.2rem'
    }
  })
})

const httpIconTitle =
  'This station might not load beacuse it is not served over secure connection'
export const StationRowItem = observer(function StationRowItem({
  station,
  showCountry = true,
  showFlag = true,
  showTags = true
}: {
  station: RadioStation
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
}) {
  const classes = useStyles({ showTags })
  const player = useMusicPlayer()

  const togglePlay = useCallback(
    (e: SyntheticEvent) => {
      console.log('target ', e.target)
      console.log('current target ', e.currentTarget)
      player.togglePlay(station)
    },
    [player, station]
  )

  const stationError = player.errorStations[station.id]

  return (
    <ButtonBase className={classes.buttonBase}>
      <ListItem
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
          </div>

          {showTags ? (
            <StationRowTags className={classes.tags} station={station} />
          ) : null}
        </ListItemText>
      </ListItem>
    </ButtonBase>
  )
})
