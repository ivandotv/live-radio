import { plural, Trans } from '@lingui/macro'
import CircularProgress from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FilterInput } from 'components/FilterInput'
import { FilterList } from 'components/FilterList'
import { LocationBreadcrumbs } from 'components/LocationBreadcrumbs'
import { useCustomSearch } from 'components/providers/CustomSearchStoreProvider'
import { RadioModel } from 'lib/client/radio-model'
import { observer } from 'mobx-react-lite'
import React, { ReactElement, useEffect, useRef } from 'react'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
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
      marginTop: theme.spacing(3),
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.contrastText
          : theme.palette.primary.main
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
  dataRow: (index: number, station: RadioModel) => ReactElement
  breadcrumbs: { href?: string; text: string }[]
  filterInputText: string
  delay?: number
}) {
  const classes = useStyles()
  const searchStore = useCustomSearch()

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchStore.search(e.currentTarget.value, delay)
  }

  const firstRender = useRef(true)
  useEffect(() => {
    firstRender.current = false
  }, [])

  const noData = (
    <div className={classes.noData}>
      <Trans>
        <p>Currently there is no data for your query.</p>
      </Trans>
    </div>
  )

  const resultPlural = searchStore.data.result
    ? `( ${searchStore.data.result.length}
      ${plural(searchStore.data.result.length, {
        one: 'result',
        other: 'results'
      })}
      )`
    : null

  return (
    <>
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
          <Trans>
            <p>
              Search service is not available at the moment. Sorry for the
              inconvenience.
            </p>
          </Trans>
        </div>
      ) : null}
    </>
  )
})
