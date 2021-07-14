import { t } from '@lingui/macro'
import { Collapse, ListItem, ListItemText, Tooltip } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import HttpIcon from '@material-ui/icons/ErrorOutline'
import clsx from 'clsx'
import { PlayerStateIcon } from 'components/music-player/PlayerStateIcon'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { PlayerStatus } from 'lib/stores/music-player-store'
import { RadioStore } from 'lib/stores/radio-store'
import { observer } from 'mobx-react-lite'
import { MouseEvent, useCallback, useState } from 'react'
import { RadioStation } from 'lib/station-utils'
import { StationRowRemoveBtn } from './StationRowRemoveBtn'

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
      marginLeft: 'auto',
      fontSize: '0.6rem',
      minHeight: '30px'
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
      color: '#ff0000',
      marginLeft: `${theme.spacing(0.5)}px`,
      fontSize: '1.2rem'
    }
  })
})

export const StationRowItem = observer(function StationRowItem({
  station,
  store,
  showCountry = true,
  showFlag = true,
  showTags = true
}: {
  station: RadioStation
  store?: RadioStore
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
}) {
  const classes = useStyles({ showTags })
  const { musicPlayer } = useRootStore()

  const togglePlay = useCallback(
    (_e: MouseEvent) => {
      musicPlayer.togglePlay(station)
    },
    [musicPlayer, station]
  )

  const stationError = musicPlayer.errorStations[station._id]
  const [show, setShow] = useState(true)

  return (
    <div className={classes.buttonBase}>
      <Collapse
        collapsedSize="0.5px"
        onExited={() => {
          console.log('on exit ')
          store!.removeLocal(station._id)
        }}
        in={show}
      >
        <ListItem
          button
          onClick={togglePlay}
          className={clsx(classes.root, {
            [classes.stationSelected]:
              musicPlayer.station?._id === station._id &&
              musicPlayer.status !== PlayerStatus.ERROR,
            [classes.stationError]: stationError
          })}
          component="div"
        >
          <ListItemText>
            <div className={classes.title}>
              <PlayerStateIcon
                className={classes.playerStateIcon}
                stationId={station._id}
                fontSize="1.3rem"
              />
              {`${station.name}`}
              {showCountry && station.country.length
                ? ` | ${station.country}`
                : null}
              {showFlag && station.flag.length ? ` ${station.flag}` : null}
              {station.url.indexOf('https') === -1 ? (
                <Tooltip
                  title={t`Depending on your browser this station might not load beacuse it is not served over a secure (https) connection.`}
                >
                  <HttpIcon className={classes.httpIcon} />
                </Tooltip>
              ) : null}
              {store ? (
                <StationRowRemoveBtn
                  className={classes.btnRemove}
                  store={store}
                  id={station._id}
                  setShow={setShow}
                />
              ) : null}
            </div>

            {showTags ? (
              <StationRowTags className={classes.tags} station={station} />
            ) : null}
          </ListItemText>
        </ListItem>
      </Collapse>
    </div>
  )
})
