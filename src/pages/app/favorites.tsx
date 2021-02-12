import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { useRootStore } from 'components/providers/RootStoreProvider'
import { getStaticTranslations } from 'lib/translations'
import { RemovableItemsList } from 'components/RemovableItemsList'

export { getStaticTranslations as getStaticProps }

// should not be wrapper in to observable!
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
        <RemovableItemsList store={favoriteStations} />
      </FilterDataStoreProvider>
    </>
  )
}

Favorites.layout = AppDefaultLayout
