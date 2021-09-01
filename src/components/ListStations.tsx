import { plural, t } from '@lingui/macro'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { layout } from 'browser-config'
import { FilterInput } from 'components/FilterInput'
import { FilterList } from 'components/FilterList'
import { LocationBreadcrumbs } from 'components/LocationBreadcrumbs'
import { useFilterDataStore } from 'components/providers/FilterDataStoreProvider'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { ListStationsFallback } from './ListStationsFallback'

const { playerHeight, mobileMenuHeight, topBarHeight, mainContentSpacer } =
  layout

const desktopContentHeight = playerHeight + topBarHeight + mainContentSpacer
const mobileContentHeight = playerHeight + topBarHeight + mobileMenuHeight
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    noData: {
      margin: theme.spacing(2),
      // display: 'flex',
      overflowY: 'auto',
      height: `calc( 100vh - ${desktopContentHeight}px )`,
      [theme.breakpoints.down('sm')]: {
        padding: 0,
        height: `calc( 100vh - ${mobileContentHeight}px )`
      }
    },
    skeletonItem: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      height: '4.5rem',
      flex: 1
    },
    skeleton: {
      height: '100%',
      overflow: 'hidden'
    },
    search: {
      margin: theme.spacing(2)
    }
  })
})

export const ListStations = observer(function ListStations({
  noData,
  dataRow,
  breadcrumbs,
  filterInputText = t`Filter Stations`,
  showSearch = true,
  showFallback = false
}: {
  noData?: ReactNode
  dataRow: (index: number, data: any) => JSX.Element
  breadcrumbs?: { href?: string; text: string }[]
  filterInputText?: string
  showFallback?: boolean
  showSearch?: boolean
}) {
  const classes = useStyles()
  const store = useFilterDataStore()
  const router = useRouter()
  const delay = 300

  if (router.isFallback || showFallback) {
    return <ListStationsFallback />
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.search(e.currentTarget.value, delay)
  }
  const resultPlural = `( ${store.filtered.length} ${plural(
    store.filtered.length,
    { one: 'result', other: 'results' }
  )} )`

  return (
    <>
      {breadcrumbs ? (
        <LocationBreadcrumbs
          links={breadcrumbs}
          tail={<span> {resultPlural} </span>}
        />
      ) : null}
      {store.allData.length ? (
        <>
          {showSearch ? (
            <FilterInput
              textPlaceHolder={filterInputText}
              className={classes.search}
              query={store.query}
              handleOnChange={handleOnChange}
            />
          ) : null}
          <FilterList dataRow={dataRow} data={store.filtered} />
        </>
      ) : (
        <div className={classes.noData}>{noData || null}</div>
      )}
    </>
  )
})
