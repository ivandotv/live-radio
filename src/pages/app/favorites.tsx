import { FavoritesList } from 'components/FavoritesList'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'initTranslations'
import { useRootStore } from 'components/providers/RootStoreProvider'

export { getStaticTranslations as getStaticProps }

export default function Favorites() {
  const { favoriteStations } = useRootStore()

  return (
    <>
      <PageTitle title={t`Your favorite Radio Stations`} />
      <FilterDataStoreProvider
        initialState={[...favoriteStations.stations]}
        uuid="id"
        indexes={['language', 'country', 'tags', 'continent', 'name']}
      >
        <FavoritesList />
      </FilterDataStoreProvider>
    </>
  )
}

Favorites.layout = AppDefaultLayout
