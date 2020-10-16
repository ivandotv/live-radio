import ListItem from '@material-ui/core/ListItem'
import { TagList } from './TagList'
import { PlayPauseBtn } from '../music-player/PlayPauseBtn'
import Button from '@material-ui/core/Button'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Skeleton from '@material-ui/lab/Skeleton'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useFilterDataStore } from './providers/StoreProvider'
import { PageTitle } from '../PageTitle'
import { FilterList } from './FilterList'
import { LocationBreadcrumbsWithResult } from './LocationBreadcrumbsWithResult'
import { PlayerStatus } from '../../lib/stores/MusicPlayerStore'
import { useMusicPlayer } from './providers/MusicPlayerProvider'
import { StationRowItem } from './StationRowItem'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    // paper: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   height: 'calc( 100vh - 72px )' // todo calculate the value dinamically
    // },
    listSkeleton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      flex: 1
    }
  })
})
export const ListData = observer(function ListData({}: // title,
// breadcrumbs
// noData
// itemRow
{
  // title: string
  // breadcrumbs: { href?: string; text: string }[]
  // noData: ReactNode
}) {
  const classes = useStyles()
  const router = useRouter()
  const store = useFilterDataStore()
  const player = useMusicPlayer()

  if (router.isFallback) {
    return (
      <>
        {new Array(5).fill(1).map((_, i) => (
          <Skeleton
            component="div"
            className={classes.listSkeleton}
            variant="rect"
            key={i}
            animation="wave"
          />
        ))}
      </>
    )
  }

  const sendQuery = (query: string, delay?: number) => {
    store.search(query, delay)
  }

  const row = function (stations: RadioStation[]) {
    return function ListRow(index: number) {
      const station = stations[index]

      return <StationRowItem station={station}></StationRowItem>
    }
  }

  return <FilterList store={store} itemRow={row}></FilterList>
})
