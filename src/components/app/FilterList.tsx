import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { ReactElement, ReactNode } from 'react'
import { Virtuoso } from 'react-virtuoso'

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
