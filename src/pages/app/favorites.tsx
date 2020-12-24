import { FavoritesList } from 'components/FavoritesList'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'initTranslations'

export { getStaticTranslations as getStaticProps }

export default function favorites() {
  return (
    <>
      <PageTitle title={t`Your favorite Radio Stations`} />
      <FilterDataStoreProvider
        initialState={[]}
        uuid="id"
        indexes={['language', 'country', 'tags', 'continent', 'name']}
      >
        <FavoritesList />
      </FilterDataStoreProvider>
    </>
  )
}

favorites.layout = AppDefaultLayout
