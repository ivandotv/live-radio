import { CustomSearchResults } from '../../../../components/app/CustomSearchResults'
import { AppDefaultLayout } from '../../../../components/app/layout/AppDefaultLayout'
import { CustomSearchProvider } from '../../../../components/app/providers/CustomSearchProvider'
import { PageTitle } from '../../../../components/PageTitle'
import { stationDataRow } from '../../../../lib/stationUtils'

export default function CustomSearch() {
  const breadcrumbs = [
    {
      href: '/app/browse',
      text: 'Browse'
    },
    {
      text: 'Custom Search'
    }
  ]

  return (
    <CustomSearchProvider>
      <PageTitle title="Custom search" />
      <CustomSearchResults
        filterInputText="Search For Stations"
        breadcrumbs={breadcrumbs}
        dataRow={stationDataRow(true, true, false)}
      />
    </CustomSearchProvider>
  )
}

CustomSearch.layout = AppDefaultLayout
