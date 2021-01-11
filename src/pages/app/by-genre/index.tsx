import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { AppMenuItem } from 'components/navigation/desktop/AppMenuItem'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { getStaticTranslations } from 'initTranslations'
import { genres } from 'generated/genres'
import { useRouter } from 'next/router'

export { getStaticTranslations as getStaticProps }

export default function GenreList() {
  const router = useRouter()
  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      href: '/app/by-genre',
      text: t`By Genre`
    }
  ]

  // remap genres so they can be searched
  const genreSearch = genres().map((genre) => {
    return {
      genre: genre.t,
      raw: genre.raw
    }
  })

  const genreDataRow = function (genres: { genre: string; raw: string }[]) {
    return function ListRow(index: number) {
      const { genre, raw } = genres[index]

      return (
        <AppMenuItem
          link={{
            prefetch: false,
            href: {
              pathname: `${router.pathname}/[genre]`
            },
            as: {
              pathname: `${router.pathname}/${raw.replace(/\s/g, '-')}`
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
      <PageTitle title={t`Search For Stations by Genre`} />
      <ListStations
        filterInputText={t`Filter Genres`}
        breadcrumbs={breadcrumbs}
        dataRow={genreDataRow}
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

GenreList.layout = AppDefaultLayout
