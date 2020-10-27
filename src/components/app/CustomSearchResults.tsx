import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { observer } from 'mobx-react-lite'
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { FilterInput } from './FilterInput'
import { FilterList } from './FilterList'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'
import { useCustomSearch } from './providers/CustomSearchProvider'
import CircularProgress from '@material-ui/core/CircularProgress'

// todo -refactor styles to be merged with BrowseBy component
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 182px )' // todo calculate the value dinamically
    },
    noData: {
      margin: theme.spacing(2)
    },
    listSkeleton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      flex: 1
    },
    search: {
      margin: theme.spacing(2)
    },
    loading: {
      alignSelf: 'center',
      marginTop: theme.spacing(3)
    },
    error: {
      margin: theme.spacing(2)
    }
  })
})
export const CustomSearchResults = observer(function CustomSearchResults({
  dataRow,
  breadcrumbs,
  filterInputText,
  delay = 500
}: {
  dataRow: (data: any) => (index: number) => ReactElement
  breadcrumbs: { href?: string; text: string }[]
  filterInputText: string
  delay?: number
}) {
  const classes = useStyles()
  const searchStore = useCustomSearch()
  //   const router = useRouter()

  console.log('custom search results ', searchStore.query)
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchStore.search(e.currentTarget.value, delay)
  }

  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])

  const noData = (
    <div className={classes.noData}>
      <p>
        Currently there is no data for your query. Sorry for the inconvenience.
      </p>
    </div>
  )

  const resultPlural = searchStore.data.result
    ? `( ${searchStore.data.result?.length} ${
        searchStore.data.result?.length === 1 ? 'result' : 'results'
      } )`
    : null

  return (
    <Paper className={classes.paper}>
      <LocationBreadcrumbs
        links={breadcrumbs}
        tail={<span>{resultPlural}</span>}
      />
      <FilterInput
        textPlaceHolder={filterInputText}
        className={classes.search}
        handleOnChange={handleOnChange}
        query={firstRender.current ? searchStore.lastQuery : searchStore.query}
      />

      {searchStore.searchInProgress ? (
        <CircularProgress className={classes.loading} size={60} thickness={5} />
      ) : searchStore.data.result ? (
        <FilterList
          dataRow={dataRow}
          data={searchStore.data.result}
          noData={noData}
        />
      ) : searchStore.data.error ? (
        <div className={classes.error}>
          <p>
            Search service is not available at the moment. Sorry for the
            inconvenience.
          </p>
        </div>
      ) : null}
    </Paper>
  )
})
