import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { observer } from 'mobx-react-lite'
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { FilterInput } from './FilterInput'
import { FilterList } from './FilterList'
import { LocationBreadcrumbsWithResult } from './LocationBreadcrumbsWithResult'
import { useCustomSearch } from './providers/CustomSearchProvider'

// todo -refactor styles to be merged with BrowseBy component
const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc( 100vh - 72px )' // todo calculate the value dinamically
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
    }
  })
})
export const CustomSearchResults = observer(function CustomSearchResults({
  noData,
  dataRow,
  breadcrumbs,
  filterInputText,
  delay = 500
}: {
  noData?: ReactNode
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

  return (
    <Paper className={classes.paper}>
      <LocationBreadcrumbsWithResult
        links={breadcrumbs}
        results={searchStore.data?.result}
      />
      <FilterInput
        textPlaceHolder={filterInputText}
        className={classes.search}
        handleOnChange={handleOnChange}
        query={firstRender.current ? searchStore.lastQuery : searchStore.query}
      />

      {searchStore.searchInProgress ? (
        <h1>search in progresss</h1>
      ) : searchStore.data?.result ? (
        <FilterList
          dataRow={dataRow}
          data={searchStore.data.result}
          noData={noData}
        />
      ) : searchStore.data?.error ? (
        <h1>show errror</h1>
      ) : null}
    </Paper>
  )
})
