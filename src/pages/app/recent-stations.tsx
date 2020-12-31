import { t } from '@lingui/macro'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { PageTitle } from 'components/PageTitle'
import { getStaticTranslations } from 'initTranslations'
import { FilterDataStoreProvider } from 'components/providers/FilterDataStoreProvider'
import { RecentStationsList } from 'components/RecentStationsList'

export { getStaticTranslations as getStaticProps }

export default function RecentStations() {
  return (
    <>
      <PageTitle title={t`Recently listened stations`} />
      <FilterDataStoreProvider
        initialState={[]}
        uuid="id"
        indexes={['language', 'country', 'tags', 'continent', 'name']}
      >
        <RecentStationsList />
      </FilterDataStoreProvider>
    </>
  )
}

RecentStations.layout = AppDefaultLayout
