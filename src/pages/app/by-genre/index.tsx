import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { ListStations } from 'components/ListStations'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { getStaticTranslations } from 'lib/translations'
import { genres } from 'generated/genres'
import { createGenreDataRow } from 'lib/utils'

export { getStaticTranslations as getStaticProps }

export default function GenreList() {
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
        dataRow={createGenreDataRow}
      ></ListStations>
    </FilterDataStoreProvider>
  )
}

GenreList.layout = AppDefaultLayout
