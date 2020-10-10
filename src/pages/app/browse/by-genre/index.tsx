import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import List from '@material-ui/core/List'
import { useRouter } from 'next/router'
import { LocationBreadcrumbs } from '../../../../components/app/LocationBreadcrumbs'
import { PageTitle } from '../../../../components/PageTitle'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { AppMenuItem } from '../../../../components/app/sidebars/AppMenuItem'
import { FilterList } from '../../../../components/app/FilterList'
import { genres } from '../../../../lib/popularGenres'
import {
  FilterStoreProvider,
  useFilterDataStore
} from '../../../../components/app/providers/StoreProvider'
import { observer } from 'mobx-react-lite'
import { BrowseBy } from '../../../../components/app/BrowseBy'

export default function GenreList() {
  const router = useRouter()
  const breadcrumbs = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      href: '/app/browse/by-genre',
      text: 'By Genre'
    }
  ]

  // remap genres so they can be searched
  const genreSearch = genres.map((genre) => {
    return {
      genre
    }
  })

  const genreDataRow = function (genres: { genre: string }[]) {
    return function ListRow(index: number) {
      const genre = genres[index].genre

      return (
        <AppMenuItem
          link={{
            href: {
              pathname: `${router.pathname}/[genre]`
            },
            as: {
              pathname: `${router.pathname}/${genre
                // .toLowerCase()
                .replace(/\s/g, '-')}`
            }
          }}
          primary={`${genre}`}
        />
      )
    }
  }

  return (
    <FilterStoreProvider
      initialState={genreSearch}
      uuid="genre"
      indexes={['genre']}
    >
      <BrowseBy
        title="Browse For Stations by Genre"
        breadcrumbs={breadcrumbs}
        dataRow={genreDataRow}
      ></BrowseBy>
    </FilterStoreProvider>
  )
}

GenreList.layout = AppDefaultLayout
