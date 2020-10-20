import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { reaction, toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useFilterDataStore } from './providers/StoreProvider'
import { FilterInput } from './FilterInput'
import { FilterDataStore } from '../../lib/stores/FilterDataStore'
import { StationRowItem } from './StationRowItem'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    scrollWrap: {
      position: 'relative',
      height: '99%'
    },
    // search: {
    //   margin: theme.spacing(2)
    // },
    noResults: {
      margin: theme.spacing(2)
    }
  })
})

export const FilterList = observer(function FilterList({
  dataRow,
  data,
  noData
}: // delay = 300,
// filterInputText
// store
{
  dataRow: (data: any) => (index: number) => ReactElement
  data: any[]
  noData?: ReactNode

  // dataRow: (index: number) => ReactElement
  // filterInputText: string
  // delay?: number
  // store: FilterDataStore
}) {
  const classes = useStyles()
  // const router = useRouter()
  // const store = useFilterDataStore()

  const noResults = noData || <p className={classes.noResults}>No results</p>

  return (
    <>
      {data.length === 0 ? (
        noResults
      ) : (
        <div className={classes.scrollWrap}>
          <Virtuoso
            totalCount={toJS(data.length)}
            overscan={40}
            item={dataRow(toJS(data))}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      )}
    </>
  )
})
