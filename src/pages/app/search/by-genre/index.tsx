import { useRouter } from 'next/router'
import { BrowseBy } from 'components/BrowseBy'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { genres } from 'lib/popularGenres'

export default function GenreList() {
  const router = useRouter()
  const breadcrumbs = [
    {
      href: '/app/search',
      text: 'Search'
    },
    {
      href: '/app/search/by-genre',
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
              pathname: `${router.pathname}/${genre.replace(/\s/g, '-')}`
            }
          }}
          primary={`${genre}`}
        />
      )
    }
  }

  return (
    <FilterDataStoreProvider
      initialState={genreSearch}
      uuid="genre"
      indexes={['genre']}
    >
      <PageTitle title="Search For Stations by Genre" />
      <BrowseBy
        filterInputText="Filter Genres"
        breadcrumbs={breadcrumbs}
        dataRow={genreDataRow}
      ></BrowseBy>
    </FilterDataStoreProvider>
  )
}

GenreList.layout = AppDefaultLayout
