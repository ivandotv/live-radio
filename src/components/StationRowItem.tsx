import { t } from '@lingui/macro'
import { Collapse, ListItem, ListItemText, Tooltip } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import HttpIcon from '@material-ui/icons/ErrorOutline'
import clsx from 'clsx'
import { PlayerStateIcon } from 'components/music-player/PlayerStateIcon'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { RadioModel } from 'lib/radio-model'
import { RadioStore } from 'lib/stores/favorites-store'
import { PlayerStatus } from 'lib/stores/music-player-store'
import { observer } from 'mobx-react-lite'
import { MouseEvent, useCallback, useState } from 'react'
import { HttpsInfoModal } from './HttpsInfoModal'
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
  showTags = true,
  showRemoveBtn = false
}: {
  station: RadioModel
  store?: RadioStore
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  showRemoveBtn?: boolean
}) {
  const classes = useStyles({ showTags })
  const { musicPlayer } = useRootStore()

  const httpsInfoText = t`Depending on your browser configuration this station might not load beacuse it is not served over a secure (httpS) connection.`

  const togglePlay = useCallback(
    (_e: MouseEvent) => {
      musicPlayer.togglePlay(station.data)
    },
    [musicPlayer, station]
  )

  const [openHttpsHelp, setOpenHttpsHelp] = useState(false)

  const closeHttpsHelp = useCallback(() => {
    setOpenHttpsHelp(false)
  }, [])

  const stationError = musicPlayer.errorStations[station.id]
  // const [show, setShow] = useState(true)

  return (
    <>
      <HttpsInfoModal
        open={openHttpsHelp}
        onClose={closeHttpsHelp}
        text={httpsInfoText}
      ></HttpsInfoModal>
      <div className={classes.buttonBase}>
        <Collapse
          collapsedSize="0.5px"
          onExited={() => {
            console.log('on exit ')
            store?.deleteStation(station.id)
          }}
          in={!station.isDeleted}
        >
          <ListItem
            button
            onClick={togglePlay}
            className={clsx(classes.root, {
              [classes.stationSelected]:
                musicPlayer.station?._id === station.id &&
                musicPlayer.status !== PlayerStatus.ERROR,
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
                {`${station.data.name}`}
                {showCountry && station.data.country.length
                  ? ` | ${station.data.country}`
                  : null}
                {showFlag && station.data.flag.length
                  ? ` ${station.data.flag}`
                  : null}
                {station.data.url.indexOf('https') === -1 ? (
                  <Tooltip
                    title={httpsInfoText}
                    onClick={(e: MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation()
                      setOpenHttpsHelp(true)
                    }}
                  >
                    <HttpIcon className={classes.httpIcon} />
                  </Tooltip>
                ) : null}
                {showRemoveBtn && store ? (
                  <StationRowRemoveBtn
                    className={classes.btnRemove}
                    station={station}
                    store={store}
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
    </>
  )
})
