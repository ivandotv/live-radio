import { t } from '@lingui/macro'
import { Collapse, ListItem, ListItemText, Tooltip } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import HttpIcon from '@material-ui/icons/ErrorOutline'
import FullHeart from '@material-ui/icons/Favorite'
import { colors } from 'browser-config'
import clsx from 'clsx'
import { PlayerStateIcon } from 'components/music-player'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { StationRowTags } from 'components/StationRowTags'
import { RadioModel } from 'lib/radio-model'
import { FavoritesStore, RadioStore } from 'lib/stores/favorites-store'
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
      alignItems: 'flex-start'
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
    },
    favIcon: {
      color: colors.favoritesHeartColor
    },
    iconWrap: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: `${theme.spacing(0.5)}px`
    },
    countryText: {
      marginLeft: theme.spacing(1)
    }
  })
})

// TODO - break component in multiple small components
export const StationRowItem = observer(function StationRowItem({
  station,
  store,
  favoriteStations,
  showCountry = true,
  showFlag = true,
  showTags = true,
  showRemoveBtn = false
}: {
  station: RadioModel
  store?: RadioStore
  favoriteStations?: FavoritesStore
  showCountry?: boolean
  showFlag?: boolean
  showTags?: boolean
  showRemoveBtn?: boolean
}) {
  const classes = useStyles({ showTags })
  const { musicPlayer } = useRootStore()

  const httpsInfoText = t`Depending on your browser configuration this station might not load beacuse it is not served over a secure (https) connection.`
  const inFavoritesText = t`Station is in your favorites list`
  if (store) {
    station = store.getStationById(station.id) ?? station
  }
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
            store?.removeStation(station.id)
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
                <div className={classes.iconWrap}>
                  {`${station.data.name}`}
                  {showFlag && station.data.flag.length
                    ? ` ${station.data.flag}`
                    : null}
                  {favoriteStations?.getStationById(station.id) ? (
                    <Tooltip title={inFavoritesText}>
                      <FullHeart classes={{ root: classes.favIcon }} />
                    </Tooltip>
                  ) : null}
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
                </div>

                {showRemoveBtn && store ? (
                  <StationRowRemoveBtn
                    className={classes.btnRemove}
                    station={station}
                    store={store}
                  />
                ) : null}
              </div>
              {showCountry && station.data.country.length ? (
                <small className={classes.countryText}>
                  {station.data.country}
                </small>
              ) : null}

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
