import ButtonBase from '@material-ui/core/ButtonBase'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useMusicPlayer } from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { PlayerStateIcon } from 'components/music-player/PlayerStateIcon'
import { PlayerStatus } from 'lib/stores/MusicPlayerStore'
import { observer } from 'mobx-react-lite'
import { SyntheticEvent, useCallback } from 'react'
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
    }
  })
})
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
            <PlayerStateIcon stationId={station.id} fontSize="1.3rem" />
            {`${station.name}`}
            {showCountry && station.country.length
              ? ` | ${station.country}`
              : null}
            {showFlag && station.flag.length ? ` ${station.flag}` : null}
          </div>
          {showTags ? (
            <StationRowTags className={classes.tags} station={station} />
          ) : null}
        </ListItemText>
      </ListItem>
    </ButtonBase>
  )
})
