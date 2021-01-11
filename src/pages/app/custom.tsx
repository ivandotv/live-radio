import { CustomSearchResults } from 'components/CustomSearchResults'
import { AppDefaultLayout } from 'components/layout/AppDefaultLayout'
import { CustomSearchStoreProvider } from 'components/providers/CustomSearchStoreProvider'
import { PageTitle } from 'components/PageTitle'
import { stationDataRow } from 'lib/stationUtils'
import { t } from '@lingui/macro'
import { getStaticTranslations } from 'initTranslations'

export { getStaticTranslations as getStaticProps }

export default function CustomSearch() {
  const breadcrumbs = [
    {
      href: '/app',
      text: t`Search`
    },
    {
      text: t`Custom Search`
    }
  ]

  return (
    <CustomSearchStoreProvider>
      <PageTitle title={t`Custom search`} />
      <CustomSearchResults
        filterInputText={t`Search For Stations`}
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow(true, true, false)}
      />
    </CustomSearchStoreProvider>
  )
}

CustomSearch.layout = AppDefaultLayout
